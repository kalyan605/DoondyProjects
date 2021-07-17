import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import "@pnp/sp/lists";
import "@pnp/sp/views";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import "@pnp/sp/fields";
import "@pnp/sp/attachments";

export default class Service{
    
    public constructor(siteUrl:string){ 
        sp.setup({
            sp: {
              baseUrl: siteUrl
            },
          });
        
    }
    
    public async addItemToSPList(data:any,fileDetails:any):Promise<any>{
        try{
             let listName:string = "allColumns";
             const iar = await sp.web.lists.getByTitle(listName).items.add(data).then(async (item)=>{
                console.log(item);
                console.log(fileDetails);
                const item1: any =  sp.web.lists.getByTitle(listName).items.getById(item.data.ID);
                await item1.attachmentFiles.add(fileDetails.name,fileDetails);
                return item;
             });
              
              //const item:any = await sp.web.lists.getByTitle(listName).items.getById(iar.data.id).get();
              //await item.attachmentFiles.add(file);
              return iar;
            
        } catch (error) {
            console.log(error);
        }
    }

    public async getUserByLogin(LoginName:string):Promise<any>{
        try{
            const user = await sp.web.siteUsers.getByLoginName(LoginName).get();
            return user;
        }catch(error){
            console.log(error);
        }
    }

}