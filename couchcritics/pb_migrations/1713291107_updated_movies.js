/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bw05or2wo7qjsck")

  // remove
  collection.schema.removeField("pw4v3qww")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vfistwby",
    "name": "image_path",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bw05or2wo7qjsck")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pw4v3qww",
    "name": "img",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "mimeTypes": [],
      "thumbs": [],
      "maxSelect": 1,
      "maxSize": 5242880,
      "protected": false
    }
  }))

  // remove
  collection.schema.removeField("vfistwby")

  return dao.saveCollection(collection)
})
