const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should;

describe('testing', function() {
    it('testing', function() {
        var comment = require('../routers/admin');
        var value = 'Promise.reject();'
        expect(value).to.be.a('string')
    })
})