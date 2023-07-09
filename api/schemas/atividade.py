from pydantic import BaseModel
from datetime import datetime
from typing import List
from model.atividade import Atividade

class AtividadeSchema(BaseModel):
    """ Define como um novo produto a ser inserido deve ser representado
    """
    data: datetime = "2023-07-12"
    nome_atividade: str = "Estudo Programação"
    dificuldade: int = 10
    tempo_gasto: str = "00:40"

class AtividadeBuscaSchema(BaseModel):
    """ Define como deve ser a estrutura que representa a busca. Que será
        feita apenas com base no nome do produto.
    """
    nome_atividade: str = "Estudo Programação"

class ListagemAtividadesSchema(BaseModel):
    """ Define como uma listagem de produtos será retornada.
    """
    atividades:List[AtividadeSchema]

def apresenta_atividades(atividades: List[Atividade]):
    """ Retorna uma representação do produto seguindo o schema definido em
       AtividadeViewSchema.
    """
    result = []
    for atv in atividades:
        result.append({
            "data": atv.data,
            "nome_atividade": atv.nome_atividade,
            "dificuldade": atv.dificuldade,
            "tempo_gasto": atv.tempo_gasto
        })

    return {"atividades": result}

class AtividadeDelSchema(BaseModel):
    """ Define como deve ser a estrutura do dado retornado após uma requisição
        de remoção.
    """
    mesage: str
    nome_atividade: str

class AtividadeViewSchema(BaseModel):
    """ Define como um produto será retornado: atividade.
    """
    id: int = 1
    data: datetime = "2023-07-12"
    nome_atividade: str = "Estudo Programação"
    dificuldade: int = 10
    tempo_gasto: str = "00:40"

def apresenta_atividade(atividade: Atividade):
    """ Retorna uma representação da atividade seguindo o schema definido em
        ProdutoViewSchema.
    """
    return {
        "id": atividade.id,
        "data": atividade.data,
        "nome_atividade": atividade.nome_atividade,
        "dificuldade": atividade.dificuldade,
        "tempo_gasto": atividade.tempo_gasto
    }
