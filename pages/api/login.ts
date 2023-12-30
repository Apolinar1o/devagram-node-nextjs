import type {NextApiRequest, NextApiResponse} from 'next';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import type {LoginResposta} from '../../types/LoginResposta';
import md5 from 'md5';
import { UsuarioModel } from '../../models/UsuarioModel';
import jwt from 'jsonwebtoken';
import { politicaCORS } from '../../middlewares/politicaCORS';

const endpointLogin = async (
    
    req : NextApiRequest,
    res : NextApiResponse<RespostaPadraoMsg | LoginResposta>
) => {
    console.log("22222222222222222222222222222222222")
    const {MINHA_CHAVE_JWT} = process.env;
    if(!MINHA_CHAVE_JWT){
        return res.status(500).json({erro : 'ENV Jwt nao informada'});
    }

    if(req.method === 'POST'){
        console.log("2222222222211111111111111111111111")

        const {login, senha} = req.body;
        const usuariosEncontrados = await UsuarioModel.find({email : login, senha : md5(senha)});
        console.log("222222222221333333333333333333")

        if(usuariosEncontrados && usuariosEncontrados.length > 0){
            console.log("usuario encontrado")

            const usuarioEncotrado = usuariosEncontrados[0];
         

            const token = jwt.sign({_id : usuarioEncotrado._id}, MINHA_CHAVE_JWT);
            return res.status(200).json({
                nome : usuarioEncotrado.nome, 
                email : usuarioEncotrado.email, 
                token});
        }
        return res.status(400).json({erro : 'Usuario ou senha nao encontrado'});
    }
    return res.status(405).json({erro : 'Metodo informado nao e valido'});
}

export default politicaCORS(conectarMongoDB(endpointLogin));