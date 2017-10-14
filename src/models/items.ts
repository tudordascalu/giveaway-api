
export class Items
{
  static keys = ['id','name', 'category', 'owner', 'pending', 'description'];

  id: string;
  category: string;
  owner: string;
  pending: string[];
  name: string;
  description: string;
  imgURL: string[];

  get dbData()
  {
    const parameters: any = {};
    Object.assign(parameters, this);
    return parameters;
  }

  constructor(data: any) { Object.assign(this, data); }

  public static fromRequest(data: any): Items
  {
    const site = new Items(data);
    // Do setup specific for websites created from a request here
    return site;
  }

  public static fromDatastore(data: any): Items
  {
    const site: any = new Items(data);
    // Do setup specific for websites created from a database query here
    return site;
  }

  // public updateRecipients(data: { deleteRecipients: string[], addRecipients: string[] })
  // {
  //   this.recipients = this.recipients.concat(data.addRecipients);
  //   for (let i = 0; i < data.deleteRecipients.length; i++)
  //   {
  //     const recipient = data.deleteRecipients[i];
  //     const index = this.recipients.indexOf(recipient);
  //     if (index !== -1)
  //     { this.recipients.splice(index, 1); }
  //   }
  // }

  public get responseData()
  {
    const parameters =
    {
      id: this.id,
      category: this.category,
      pending: this.pending, 
      owner: this.owner,
      name: this.name,
      description: this.description
    };
    return parameters;
  }
}
