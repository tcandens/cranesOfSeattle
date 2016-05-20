import test from 'ava';
import permitModel from '../../src/resources/permits/model';

test('permitModel#fetchAll', async t => {
  const permits = await permitModel.fetchAll();
  t.true((permits instanceof Array), 'Returns array.');
})
