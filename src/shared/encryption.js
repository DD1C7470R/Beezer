import * as openpgp from 'openpgp';
// import * as openpgp from '../../node_modules/openpgp.min.mjs';

// console.log(openpgp);
export const decrypt= async (encrypted,Key) =>{
    try{
      const passphrase = 'qwerty'
      const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readKey({ armoredKey: Key }),
        passphrase
    })
   
        return await openpgp.decrypt({
                message: await openpgp.readMessage({
                      armoredMessage: encrypted // parse armored message
                  }),
                 privateKeys:privateKey
              });
        
    }
    catch(error){
        console.log('error',error);
    }
    
  }

 
 export const encrypt = async function (itemTobeEncrypted, publicKey) {
   
  const message = await openpgp.createMessage({ text : JSON.stringify(itemTobeEncrypted) });

   const encrypted = await openpgp.encrypt({
      message,
        publicKeys: await openpgp.readKey({ armoredKey: publicKey })
      });

      return  encrypted;
    }

export  {openpgp};