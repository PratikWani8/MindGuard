"""Text processing utilities."""
import re
from typing import List


def clean_text(text: str) -> str:
    """Clean and normalize text input."""
    if not text:
        return ""
    
    # Remove excessive whitespace
    text = re.sub(r'\s+', ' ', text)
    
    # Strip leading/trailing whitespace
    text = text.strip()
    
    return text


def truncate_text(text: str, max_length: int = 5000) -> str:
    """Truncate text to maximum length."""
    if len(text) <= max_length:
        return text
    return text[:max_length]


def extract_keywords(text: str) -> List[str]:
    """Extract potential keywords from text (simple implementation)."""
    # Remove common stop words
    stop_words = {
        'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your',
        'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she',
        'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their',
        'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that',
        'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
        'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an',
        'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of',
        'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through',
        'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down',
        'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once'
    }
    
    # Tokenize and filter
    words = re.findall(r'\b\w+\b', text.lower())
    keywords = [w for w in words if w not in stop_words and len(w) > 3]
    
    # Return unique keywords
    return list(set(keywords))[:10]


def detect_stress_indicators(text: str) -> List[str]:
    """Detect stress indicators in text."""
    indicators = []
    text_lower = text.lower()
    
    stress_patterns = {
        'academic pressure': ['exam', 'test', 'assignment', 'study', 'grades', 'homework', 'school', 'university'],
        'work stress': ['work', 'job', 'deadline', 'boss', 'project', 'meeting', 'overtime'],
        'relationship concerns': ['relationship', 'partner', 'breakup', 'argument', 'friend', 'family'],
        'financial stress': ['money', 'debt', 'bills', 'financial', 'afford', 'expensive'],
        'health concerns': ['health', 'sick', 'pain', 'doctor', 'hospital', 'illness'],
        'sleep concerns': ['sleep', 'insomnia', 'tired', 'exhausted', 'fatigue', 'rest'],
        'anxiety symptoms': ['anxious', 'anxiety', 'worry', 'nervous', 'panic', 'fear'],
        'depression symptoms': ['depressed', 'depression', 'hopeless', 'empty', 'worthless', 'sad']
    }
    
    for indicator, keywords in stress_patterns.items():
        if any(keyword in text_lower for keyword in keywords):
            indicators.append(indicator)
    
    return indicators
