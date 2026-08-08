from pathlib import Path
import hashlib

try:
    import chromadb
except ImportError:
    chromadb = None


class RAGService:
    def __init__(self, knowledge_base_path: str, vector_db_path: str, embedding_model):
        self.kb_path = Path(knowledge_base_path)
        self.embedding_model = embedding_model
        self.collection = None
        self._build_index(vector_db_path)

    def _build_index(self, vector_db_path: str):
        if chromadb is None:
            return
        self.kb_path.mkdir(parents=True, exist_ok=True)
        client = chromadb.PersistentClient(path=vector_db_path)
        self.collection = client.get_or_create_collection("mindguard_knowledge")

        docs = []
        for path in self.kb_path.rglob("*"):
            if path.is_file() and path.suffix.lower() in {".txt", ".md"}:
                text = path.read_text(encoding="utf-8", errors="ignore")
                chunks = [text[i:i+900] for i in range(0, len(text), 750)]
                for idx, chunk in enumerate(chunks):
                    if chunk.strip():
                        docs.append((path, idx, chunk))

        if not docs:
            return

        existing = self.collection.count()
        if existing:
            return

        texts = [x[2] for x in docs]
        embeddings = self.embedding_model.encode(texts).tolist()
        ids = [hashlib.sha1(f"{x[0]}:{x[1]}".encode()).hexdigest() for x in docs]
        metadatas = [{"title": x[0].stem, "source": str(x[0])} for x in docs]

        self.collection.add(
            ids=ids,
            documents=texts,
            embeddings=embeddings,
            metadatas=metadatas,
        )

    def retrieve(self, query: str, k: int = 4) -> list[dict]:
        if not self.collection or self.collection.count() == 0:
            return []
        embedding = self.embedding_model.encode([query])[0].tolist()
        result = self.collection.query(query_embeddings=[embedding], n_results=k)
        docs = result.get("documents", [[]])[0]
        metas = result.get("metadatas", [[]])[0]
        return [
            {"text": doc, "title": meta.get("title", "Knowledge base"), "source": meta.get("source", "")}
            for doc, meta in zip(docs, metas)
        ]
