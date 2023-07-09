from flask_openapi3 import OpenAPI, Info, Tag
from flask import redirect
from urllib.parse import unquote

from sqlalchemy.exc import IntegrityError

from model import Session, Atividade
from logger import logger
from schemas import *
from flask_cors import CORS

info = Info(title="API Minha Produtividade", version="1.0.0")
app = OpenAPI(__name__, info=info)
CORS(app)

# definindo tags
home_tag = Tag(name="Documentação", description="Seleção de documentação: Swagger, Redoc ou RapiDoc")
atividade_tag = Tag(name="Atividade", description="Adição, visualização e remoção de atividades à base")


@app.get('/', tags=[home_tag])
def home():
    """Redireciona para /openapi, tela que permite a escolha do estilo de documentação.
    """
    return redirect('/openapi')


@app.post('/atividade', tags=[atividade_tag],
          responses={"200": AtividadeViewSchema, "409": ErrorSchema, "400": ErrorSchema})
def add_atividade(form: AtividadeSchema):
    """Adiciona uma nova Atividade à base de dados

    Retorna uma representação das atividades associadas.
    """
    atividade = Atividade(
        data=form.data,
        nome_atividade=form.nome_atividade,
        dificuldade=form.dificuldade,
        tempo_gasto=form.tempo_gasto)
    logger.debug(f"Adicionando uma nova atividade: '{atividade.nome_atividade}'")
    try:
        session = Session()
        session.add(atividade)
        session.commit()
        logger.debug(f"Adicionando uma nova atividade: '{atividade.nome_atividade}'")
        return apresenta_atividade(atividade), 200
    
    except IntegrityError as e:
        # como a duplicidade do nome é a provável razão do IntegrityError
        error_msg = "Atividade de mesmo nome já salvo na base :/"
        logger.warning(f"Erro ao adicionar atividade, {error_msg}")
        return {"mesage": error_msg}, 409

    except Exception as e:
        # caso um erro fora do previsto
        error_msg = "Não foi possível salvar nova atividade :/"
        logger.warning(f"Erro ao adicionar atividade, {error_msg}")
        return {"mesage": error_msg}, 400


@app.get('/atividades', tags=[atividade_tag],
         responses={"200": ListagemAtividadesSchema, "404": ErrorSchema})
def get_atividades():
    """Faz a busca por todos as Atividades cadastradas

    Retorna uma representação da listagem de atividades.
    """
    logger.debug(f"Coletando todas as atividades")
    # criando conexão com a base
    session = Session()
    # fazendo a busca
    atividades = session.query(Atividade).all()

    if not atividades:
        # se não há atividade cadastrada
        return {"atividades": []}, 200
    else:
        logger.debug(f"%d atividades econtradas" % len(atividades))
        # retorna a representação da atividade
        print(atividades)
        return apresenta_atividades(atividades), 200


@app.delete('/delAtividade', tags=[atividade_tag],
            responses={"200": AtividadeDelSchema, "404": ErrorSchema})
def del_atividade(query: AtividadeBuscaSchema):
    """Deleta uma Atividade a partir do nome de produto informado
    Retorna uma mensagem de confirmação da remoção.
    """
    atividade_nome = unquote(unquote(query.nome_atividade))
    print(atividade_nome)
    logger.debug(f"Deletando dados sobre a atividade #{atividade_nome}")
    # criando conexão com a base
    session = Session()
    # fazendo a remoção
    count = session.query(Atividade).filter(Atividade.nome_atividade == atividade_nome).delete()
    session.commit()

    if count:
        # retorna a representação da mensagem de confirmação
        logger.debug(f"Deletado atividade #{atividade_nome}")
        return {"mesage": "Atividade removida", "id": atividade_nome}
    else:
        # se a atividade não for encontrada
        error_msg = "Atividade não encontrada na base :/"
        logger.warning(f"Erro ao deletar atividade #'{atividade_nome}', {error_msg}")
        return {"mesage": error_msg}, 404

