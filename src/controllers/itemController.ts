import { Request, Response } from 'express';
import * as uuid from 'uuid/v4';
import { config } from '../config/config';
import { HTTPBody } from '../protocols/http';
import { DataStore } from './../datastore/datastore';
import { Items } from './../models/items';
import { HTTPResponse } from './../output/response';

export class ItemController
{
  // req body: sender, recipients,message, subject
  public static createItem(req: Request, res: Response, next: Function)
  {
    const body = req.body;
    const user = res.locals.username;

    let missing;
    if (missing = HTTPBody.missingFields(body, ['category', 'name', 'description', 'imgURL'],))
    { return HTTPResponse.missing(res, missing, 'body'); }

    if (body.name.length === 0)
    { return HTTPResponse.error(res, 'name must not be empty', 400); }

    body.id = uuid();
    body.owners = [user];
    const item = Items.fromRequest(body);

    DataStore.local.items.addOrUpdate({ id: item.id }, item.dbData, {},
      (err, dbData) =>
      {
        if (err) return HTTPResponse.error(res, 'error creating the list in db', 400);
        else HTTPResponse.json(res, dbData.id);
      },
    );
  }

  public static getAllItems(req: Request, res: Response, next: Function)
  {
    const user = res.locals.username;

    DataStore.local.items.find({}, {},
      (err, dbData) =>
      {
        if (err || dbData.length === 0) { return HTTPResponse.json(res, []); }
        let itemList = [];
        for (let i = 0; i < dbData.length; i++)
        {
          const item = Items.fromDatastore(dbData[0]);
          itemList.push(item.responseData);
        }
        HTTPResponse.json(res, itemList);
      },
    );
  }

  public static getSpecificItem(req: Request, res: Response, next: Function)
  {
    const user = res.locals.username;

    DataStore.local.items.find({ id: req.params.id }, {},
      (err, dbData) =>
      {
        if (err || dbData.length === 0) { return HTTPResponse.error(res, 'item does not exist or you cannot access it', 400); }
        const item = Items.fromDatastore(dbData[0]);
        HTTPResponse.json(res, item.responseData);
      },
    );
  }

  public static deleteItem(req: Request, res: Response, next: Function)
  {
    const user = res.locals.username;

    DataStore.local.items.find({ id: req.params.id }, {},
      (err, dbData) =>
      {
        if (err || dbData.length === 0) { return HTTPResponse.error(res, 'item does not exist or you cannot access it', 400); }
        const item = dbData[0];

        if (item.owners.length === 1)
        {
          DataStore.local.items.remove({ id: item.id }, {},
            (err, dbData) =>
            {
              if (err) { return HTTPResponse.error(res, 'item does not exist or you cannot access it', 400); }
              HTTPResponse.success(res);
            },
          );
        }
        else
        {
          for (let i = 0; i < item.owners.length; i++)
          {
            if (item.owners[i] === user) { item.owners.splice(i, 1); }
            break;
          }
          DataStore.local.items.addOrUpdate({ id: item.id }, item, {},
            (err, dbData) =>
            {
              if (err || dbData.length === 0) { return HTTPResponse.error(res, 'error updating the list in db', 400); }
              HTTPResponse.success(res);
            },
          );
        }
      },
    );
  }

  // public static updateList(req: Request, res: Response, next: Function)
  // {
  //   const user = res.locals.username;
  //   const recipients = { addRecipients: req.body.add, deleteRecipients: req.body.delete};

  //   DataStore.local.recipients.find({ id: req.params.id, owners: user }, {},
  //     (err, dbData) =>
  //     {
  //       if (err || dbData.length === 0) { return HTTPResponse.error(res, 'recipients lists does not exist or you cannot access it', 400); }

  //       let list = new RecipientList(dbData[0]);

  //       list.updateRecipients(recipients);
  //       DataStore.local.recipients.addOrUpdate({ id: list.id }, list, {},
  //         (err, dbData) =>
  //         {
  //           if (err) { return HTTPResponse.error(res, 'error updating the list in db', 400); }

  //           const list = RecipientList.fromDatastore(dbData[0]);
  //           HTTPResponse.json(res, list.responseData);
  //         },
  //       );
  //     },
  //   );
  // }
}
