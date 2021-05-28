'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
  const { jwt } = app;
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/add', jwt, controller.home.add);
  router.post('/find', controller.home.find);
  router.post('/login', controller.home.login);
  router.post('/sql/findRecord', jwt, controller.home.findRecords);
  router.post('/sql/deleteBook', jwt, controller.home.deleteBook);
  router.post('/sql/updateBook', jwt, controller.home.updateBook);
  router.post('/sql/borrowBook', jwt, controller.home.borrowBook);
  router.post('/sql/returnBook', jwt, controller.home.returnBook);
  router.post('/sql/addbooklist', jwt, controller.home.addbooklist);
};
