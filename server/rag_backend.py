from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain.chat_models import init_chat_model
from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableLambda
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
import os, re

load_dotenv()

embeddings = HuggingFaceEmbeddings()
llm = init_chat_model(model="groq:llama-3.1-8b-instant")
parser = StrOutputParser()

system_prompt = (
    """You are a helpful AI Assistant which helps in answering questions regarding a YouTube video.
    Answer ONLY from the given transcript context.
    If the context is insufficient, say that you don't know.
    {context}"""
)

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{question}")
])



def fetch_video_transcript(video_id):
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
        transcript = " ".join(chunk["text"] for chunk in transcript_list)
        return transcript
    except TranscriptsDisabled:
        print("Transcript not available")
        return None


from chromadb.config import Settings

persist_dir = "chroma_store"
def rag(video_id, transcript, question):
    collection_name = f"yt_{video_id}"
    video_path = os.path.join(persist_dir, video_id)

    if os.path.exists(video_path):
        vector_store = Chroma(
            collection_name=collection_name,
            embedding_function=embeddings,
            persist_directory=video_path
        )
    else:
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = splitter.create_documents([transcript])
        vector_store = Chroma.from_documents(
            documents=chunks,
            embedding=embeddings,
            collection_name=collection_name,
            persist_directory=video_path
        )

    retriever = vector_store.as_retriever(search_type="mmr", search_kwargs={"k": 4})

    parallel_chain = RunnableParallel({
    "context": retriever | RunnableLambda(lambda docs: "\n\n".join(doc.page_content for doc in docs)),
    "question": lambda q:q
})

    main_chain = parallel_chain | prompt | llm | parser

    answer = main_chain.invoke(question)

    return answer

