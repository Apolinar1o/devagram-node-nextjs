import multer from "multer";
import cosmicjs from "cosmicjs";
import { createBucketClient } from '@cosmicjs/sdk'

const {
    CHAVE_GRAVACAO_AVATARES,
    CHAVE_GRAVACAO_PUBLICACOES,
    BUCKET_AVATARES,
    BUCKET_PUBLICACOES} = process.env;

 

const bucketAvatares = createBucketClient({
  bucketSlug:  BUCKET_AVATARES??"",
  readKey: '',
  writeKey: CHAVE_GRAVACAO_AVATARES
})

const bucketPublicacoes = createBucketClient({
  bucketSlug:  BUCKET_PUBLICACOES??"",
  readKey: '',
  writeKey: CHAVE_GRAVACAO_PUBLICACOES
})




// const Cosmic = cosmicjs();
// const bucketAvatares = Cosmic.bucket({
//     slug: BUCKET_AVATARES,
//     write_key: CHAVE_GRAVACAO_AVATARES
// });

// const bucketPublicacoes = Cosmic.bucket({
//     slug: BUCKET_PUBLICACOES,
//     write_key: CHAVE_GRAVACAO_PUBLICACOES
// });
const storage = multer.memoryStorage();
const updload = multer({storage : storage});

const uploadImagemCosmic = async(req : any) => {
    if(req?.file?.originalname){

        if(!req.file.originalname.includes('.png') &&
            !req.file.originalname.includes('.jpg') && 
            !req.file.originalname.includes('.jpeg')){
                throw new Error('Extensao da imagem invalida');
        } 
        const media_object = {
            originalname: req.file.originalname,
            buffer : req.file.buffer
        };
       
        if(req.url && req.url.includes('publicacao')){
            return await bucketPublicacoes.media.insertOne({media : media_object});
        }else{

            return await bucketAvatares.media.insertOne({media : media_object});
        }
    }
}

export {updload, uploadImagemCosmic};

