const express = require('express')
const router = express.Router()
const employeesController = require('../../controllers/employeesControler')
const verifyJWT = require('../../middleware/verifyJWT')

router
  .route('/')
  .get(verifyJWT, employeesController.getAllEmployees)
  .post(employeesController.createNewEmployees)
  .put(employeesController.updateEmployees)
  .delete(employeesController.deleteEmployees)

router.route('/:id').get(employeesController.getEmployees)

module.exports = router
