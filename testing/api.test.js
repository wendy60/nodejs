const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should;

describe('testing', function() {
    it('testing', function() {
        var comment = require('../routers/api');
        var value = 'user.save();'
        expect(value).to.be.a('string')
    })
})