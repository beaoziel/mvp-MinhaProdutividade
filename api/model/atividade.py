from sqlalchemy import Column, String, Integer, DateTime
from  model import Base

 
class Atividade(Base):
    __tablename__ = 'atividade'

    id = Column("pk_atividade", Integer, primary_key=True)
    data = Column(DateTime)
    nome_atividade = Column(String(120))
    dificuldade = Column(Integer)
    tempo_gasto = Column(String(5))


    def __init__(self, data:DateTime, nome_atividade:str, dificuldade:int,
                 tempo_gasto:str):
        self.data = data
        self.nome_atividade = nome_atividade
        self.dificuldade = dificuldade
        self.tempo_gasto = tempo_gasto
