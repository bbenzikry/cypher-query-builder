import { ParameterContainer } from './parameterContainer';
import { ParameterBag } from './parameterBag';
import { expect } from '../test-setup';

describe('ParameterContainer', function() {
  describe('#useParameterBag', function() {
    // it('should store the new bag in the class', function() {
    //   let bag = new ParameterBag();
    //   let container = new ParameterContainer();
    //   expect(container.parameterBag).to.not.equal(bag);
    //   container.useParameterBag(bag);
    //   expect(container.parameterBag).to.equal(bag);
    // });

    it('should merge properties from the existing bag to the new one', function() {
      let container = new ParameterContainer();
      container.addParam('container value', 'name');

      let bag = new ParameterBag();
      bag.addParam('bag value', 'name');
      container.useParameterBag(bag);

      let params = container.getParams();
      expect(params).to.have.property('name', 'bag value');
      expect(params).to.have.property('name2', 'container value');
    });

    it('should not recreate the Parameter objects', function() {
      let container = new ParameterContainer();
      let param = container.addParam('container value', 'name');

      let bag = new ParameterBag();
      bag.addParam('bag value', 'name');
      container.useParameterBag(bag);

      expect(param.name).to.equal('name2');
      expect(container.getParameterBag().getParam('name2')).to.equal(param);
    });
  });

  describe('#getParams', function() {
    it('should return the params', function() {
      let container = new ParameterContainer();
      container.addParam('value1', 'string');
      container.addParam(7, 'number');

      expect(container.getParams()).to.deep.equal({
        'string': 'value1',
        'number': 7,
      });
    });
  });
});
