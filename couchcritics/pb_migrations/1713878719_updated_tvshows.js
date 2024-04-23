/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4oecb2s3mtza08d")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "irscjvbr",
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
  const collection = dao.findCollectionByNameOrId("4oecb2s3mtza08d")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "irscjvbr",
    "name": "image_Path",
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
})
