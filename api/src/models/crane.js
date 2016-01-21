import modelFactory from './base'
import { keys } from 'lodash'

const craneModel = modelFactory('cranes');

craneModel.report = function(crane) {
  return {id: '001'};
};

export default craneModel
