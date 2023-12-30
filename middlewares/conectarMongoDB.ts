import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import mongoose from 'mongoose';
import type {RespostaPadraoMsg} from '../types/RespostaPadraoMsg';

export const conectarMongoDB = (handler : NextApiHandler) =>
    async (req: NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any[]>) => {

    // verificar se o banco ja esta conectado, se estiver seguir 
    // para o endpoint ou proximo middleware
    if(mongoose.connections[0].readyState){
        return handler(req, res);
    }
    console.log("333331111111111111111111")

    // ja que nao esta conectado vamos conectar
    // obter a variavel de ambiente preenchida do env
    const {DB_CONEXAO_STRING} = process.env;
    console.log("333332222222222222222222222222")
    // se a env estiver vazia aborta o uso do sistema e avisa o programador
    if(!DB_CONEXAO_STRING){
        return res.status(500).json({ erro : 'ENV de configuracao do banco, nao informado'});
    }
    console.log("3333444444444444444444444442")

    mongoose.connection.on('connected', () => console.log('Banco de dados conectado'));
    mongoose.connection.on('error', error => console.log(`Ocorreu erro ao conectar no banco: ${error}`));
    console.log("33334555555555555555555555555555")
    // await mongoose.connect(DB_CONEXAO_STRING);
    console.log("333366666666666666666666666666")
  
    return handler(req, res);
}