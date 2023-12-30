import type {NextApiRequest, NextApiResponse} from 'next';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import type {CadastroRequisicao} from '../../types/CadastroRequisicao';
import {UsuarioModel} from '../../models/UsuarioModel';
import {conectarMongoDB} from '../../middlewares/conectarMongoDB';
import md5 from 'md5';
import {updload, uploadImagemCosmic} from '../../services/uploadImagemCosmic';
import nc from 'next-connect';
import { politicaCORS } from '../../middlewares/politicaCORS';

const handler = nc()
    .use(updload.single('file'))
    .post(async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {
        try{
            console.log("((((((111111111111111111111111111111111111111))))))")
            const usuario = req.body as CadastroRequisicao;
            console.log("22222222222222222222222222222222222")
            if(!usuario.nome || usuario.nome.length < 2){
                return res.status(400).json({erro : 'Nome invalido'});
            }
            console.log("22222222222333333333333333333")
            if(!usuario.email || usuario.email.length < 5
                || !usuario.email.includes('@')
                || !usuario.email.includes('.')){
                return res.status(400).json({erro : 'Email invalido'});
            }
            console.log("22222222222444444444444444444444444")
            if(!usuario.senha || usuario.senha.length < 4){
                return res.status(400).json({erro : 'Senha invalida'});
            }
            console.log("222222222225555555555555555555555555555555")

            // validacao se ja existe usuario com o mesmo email
            const usuariosComMesmoEmail = await UsuarioModel.find({email : usuario.email});
            if(usuariosComMesmoEmail && usuariosComMesmoEmail.length > 0){
                return res.status(400).json({erro : 'Ja existe uma conta com o email informado'});
            }
            console.log("222222222226666666666666666666666")
            // enviar a imagem do multer para o cosmic
            const image = await uploadImagemCosmic(req);
            console.log("222222222227777777777777777")

            // salvar no banco de dados
            const usuarioASerSalvo = {
                nome : usuario.nome,
                email : usuario.email,
                senha : md5(usuario.senha),
                avatar : image?.media?.url
            }
            console.log("---------------------------")

            await UsuarioModel.create(usuarioASerSalvo);
            return res.status(200).json({msg : 'Usuario criado com sucesso'});
        }catch(e : any){
            console.log(e);
            return res.status(400).json({erro : e.toString()});
        }
});

export const config = {
    api: {
        bodyParser : false
    }
}

export default politicaCORS(conectarMongoDB(handler));