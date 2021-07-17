import { sp } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import "@pnp/sp/lists";
import "@pnp/sp/views";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import "@pnp/sp/fields";
import "@pnp/sp/attachments";
import "@pnp/sp/files";

export default class Service {

    public mysitecontext: any;

    public constructor(siteUrl: string, Sitecontext: any) {
        this.mysitecontext = Sitecontext;


        sp.setup({
            sp: {
                baseUrl: siteUrl

            },
        });



    }

    public async GetData(data: any) {



        try {

            const selectedList = 'SpCatlog';

            if (data.SelcatVal.key == 'Category') {

                if (data.UserFindVal == false) {

                    alert('one');

                    const strhide = 'No';
                    let filtercondition: any = "substringof('" + data.Title + "',Category) and (ToggleHide eq '" + strhide + "')";
                    const allItems: any[] = await sp.web.lists.getByTitle(selectedList).items.filter(filtercondition).getAll();
                    return allItems;


                }

                else if (data.UserFindVal == true) {



                    let filtercondition: any = "substringof('" + data.Title + "',Category)";
                    const allItems: any[] = await sp.web.lists.getByTitle(selectedList).items.filter(filtercondition).getAll();
                    return allItems;


                }



            }

            if (data.SelcatVal.key == 'ApplicationName') {

                if (data.UserFindVal == false) {

                    const strhide = 'No';
                    let filtercondition: any = "substringof('" + data.Title + "',Title) and (ToggleHide eq '" + strhide + "')";
                    const allItems: any[] = await sp.web.lists.getByTitle(selectedList).items.filter(filtercondition).getAll();
                    return allItems;
                }

                else if (data.UserFindVal == true) {

                    let filtercondition: any = "substringof('" + data.Title + "',Title)";
                    const allItems: any[] = await sp.web.lists.getByTitle(selectedList).items.filter(filtercondition).getAll();
                    return allItems;
                }

            }


        }

        catch (error) {

            console.log(error);
        }

    }





    public async pagGetData(data: any) {



        try {

            const selectedList = 'SpCatlog';

            if (data.SelcatVal.key == 'Category') {

                if (data.UserFindVal == false) {

                    alert('one');

                    let items: any;

                    const strhide = 'No';
                    let filtercondition: any = "substringof('" + data.Title + "',Category) and (ToggleHide eq '" + strhide + "')";
                    const allItems: any[] = await sp.web.lists.getByTitle(selectedList).items.filter(filtercondition).getAll();
                    return allItems;

                }

                else if (data.UserFindVal == true) {



                    let filtercondition: any = "substringof('" + data.Title + "',Category)";
                    const allItems: any[] = await sp.web.lists.getByTitle(selectedList).items.filter(filtercondition).getAll();
                    return allItems;


                }



            }

            if (data.SelcatVal.key == 'ApplicationName') {

                if (data.UserFindVal == false) {

                    const strhide = 'No';
                    let filtercondition: any = "substringof('" + data.Title + "',Title) and (ToggleHide eq '" + strhide + "')";
                    const allItems: any[] = await sp.web.lists.getByTitle(selectedList).items.filter(filtercondition).getAll();
                    return allItems;
                }

                else if (data.UserFindVal == true) {

                    let filtercondition: any = "substringof('" + data.Title + "',Title)";
                    const allItems: any[] = await sp.web.lists.getByTitle(selectedList).items.filter(filtercondition).getAll();
                    return allItems;
                }

            }


        }

        catch (error) {

            console.log(error);
        }

    }







    public async getItemByID(ItemID: any): Promise<any> {
        try {

            const selectedList = 'SpCatlog';
            const Item: any[] = await sp.web.lists.getByTitle(selectedList).items.getById(ItemID).get();
            return Item;
        } catch (error) {
            console.log(error);
        }
    }

    public async isCurrentUserMemberOfGroup(groupName: string) {
        return await sp.web.currentUser.groups().then((groups: any) => {
            let groupExist = false;
            groups.map((group: any) => {
                if (group.Title = groupName) {
                    groupExist = true;
                }
            });
            return groupExist;
        });

    }


    public async getCurrentUser(): Promise<any> {
        try {
            return await sp.web.currentUser.get().then(result => {
                return result;
            });
        } catch (error) {
            console.log(error);
        }
    }



    public async getCurrentUserSiteGroups(): Promise<any[]> {

        try {

            return (await sp.web.siteGroups.select("Id,Title,Description,OwnerTitle,OnlyAllowMembersViewMembership,AllowMembersEditMembership,Owner/Id,Owner/LoginName").expand('Owner').get());

        }
        catch {
            throw 'get current user site groups failed.';
        }

    }






}