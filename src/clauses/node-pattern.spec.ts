import { expect } from 'chai';
import { NodePattern } from './node-pattern';
import { keys, values } from 'lodash';

describe('Node', function() {
  describe('#build', function() {
    let conditions = { name: 'Steve', active: true };

    it('should build a node pattern with a variable name', function() {
      let node = new NodePattern('person');
      let queryObj = node.buildQueryObject();
      expect(queryObj.query).to.equal('(person)');
      expect(queryObj.params).to.be.empty;
    });

    it('should build a node pattern with a label', function() {
      let node = new NodePattern('person', 'Person');
      let queryObj = node.buildQueryObject();
      expect(queryObj.query).to.equal('(person:Person)');
      expect(queryObj.params).to.be.empty;
    });

    it('should build a node pattern with multiple labels', function() {
      let node = new NodePattern('person', ['Person', 'Staff', 'Female']);
      let queryObj = node.buildQueryObject();
      expect(queryObj.query).to.equal('(person:Person:Staff:Female)');
      expect(queryObj.params).to.be.empty;
    });

    it('should build a node pattern with just labels', function() {
      let node = new NodePattern(['Person', 'Staff', 'Female']);
      let queryObj = node.buildQueryObject();
      expect(queryObj.query).to.equal('(:Person:Staff:Female)');
      expect(queryObj.params).to.be.empty;
    });

    it('should build a node pattern with just conditions', function() {
      let node = new NodePattern(conditions);
      let queryObj = node.buildQueryObject();

      expect(queryObj.query).to.equal('({ name: $name, active: $active })');
      expect(keys(queryObj.params)).to.have.length(2);
      expect(values(queryObj.params)).to.have.members(['Steve', true]);
    });

    it('should build a node pattern with a name and conditions', function() {
      let node = new NodePattern('person', conditions);
      let queryObj = node.buildQueryObject();

      expect(queryObj.query).to.equal('(person { name: $name, active: $active })');
      expect(keys(queryObj.params)).to.have.length(2);
      expect(values(queryObj.params)).to.have.members(['Steve', true]);
    });

    it('should build a node pattern with labels and conditions', function() {
      let node = new NodePattern([ 'Person', 'Staff' ], conditions);
      let queryObj = node.buildQueryObject();

      expect(queryObj.query).to.equal('(:Person:Staff { name: $name, active: $active })');
      expect(keys(queryObj.params)).to.have.length(2);
      expect(values(queryObj.params)).to.have.members(['Steve', true]);
    });

    it('should build a node pattern with condensed conditions', function() {
      let node = new NodePattern('person', [], conditions);
      node.setExpandedConditions(false);
      let queryObj = node.buildQueryObject();

      expect(queryObj.query).to.equal('(person $conditions)');
      expect(keys(queryObj.params)).to.have.length(1);
      expect(values(queryObj.params)).to.have.members([conditions]);
    });

    it('should build a node pattern with expanded conditions', function() {
      let node = new NodePattern('person', [], conditions);
      let queryObj = node.buildQueryObject();

      expect(queryObj.query).to.equal('(person { name: $name, active: $active })');
      expect(keys(queryObj.params)).to.have.length(2);
      expect(values(queryObj.params)).to.have.members(['Steve', true]);
    });

    it('should build a complete node pattern', function() {
      let node = new NodePattern(
        'person',
        ['Person', 'Staff', 'Female'],
        conditions
      );
      let queryObj = node.buildQueryObject();

      expect(queryObj.query).to.equal('(person:Person:Staff:Female { name: $name, active: $active })');
      expect(keys(queryObj.params)).to.have.length(2);
      expect(values(queryObj.params)).to.have.members(['Steve', true]);

      node.setExpandedConditions(false);
      queryObj = node.buildQueryObject();
      expect(queryObj.query).to.equal('(person:Person:Staff:Female $conditions)');
      expect(keys(queryObj.params)).to.have.length(1);
      expect(values(queryObj.params)).to.have.members([conditions]);
    });
  });
});