var pcmd = require('./protocommand');
var chai = require("chai");
pcmd.size = 5;

var should = chai.should();
var expect = chai.expect;

function makeBufferFrom(str) {
    var buf = new Buffer(str.length);
    buf.write(str);
    return buf;
}

describe('Test Suite', function(){
    describe('BUFFER TESTS', function(){
        it('should deny bad buffer', function(){
            expect(pcmd.get(makeBufferFrom("CMND TEST"))).to.be.false;
        })
        it('should parse good buffer', function(){
            expect(pcmd.get(makeBufferFrom("GOODB ALL GOOD"))).to.equal('GOODB');
        })
        it('should deny based on regex test', function(){
            expect(pcmd.get(makeBufferFrom("BAD'B ALL BAD"))).to.be.false;
        })
        it('should deny based on buffer size', function(){
            expect(pcmd.get(makeBufferFrom("BADB"))).to.be.false;
        })
        it('should deny based on next', function(){
            expect(pcmd.get(makeBufferFrom("BADBDD"))).to.be.false;
        })
        it('should accept based on next', function(){
            expect(pcmd.get(makeBufferFrom("GOODC "))).to.equal("GOODC");
        })
    })
    describe('PARSING TESTS', function(){
        it('should parse parameters', function(){
            expect(pcmd.params(makeBufferFrom("GOODC GOODP1 GOODP2"))).to.deep.equal(['GOODP1', 'GOODP2']);
        })
        it('should parse based on next char', function(){
            pcmd.next = '|';
            expect(pcmd.params(makeBufferFrom("GOODC|GOODP1|GOODP2"))).to.deep.equal(['GOODP1', 'GOODP2']);
        })
        it('should not parse incorrect parameters', function(){
            expect(pcmd.params(makeBufferFrom("GOODC GOODP1 GOODP2"))).to.be.false;
        })
    })
    describe('MAKE TESTS', function(){
        it('should create correct commmands', function(){
            pcmd.size = 4;
            expect(pcmd.make('TEST', 'THIS', 'THAT')).to.equal('TEST|THIS|THAT');
        })
        it('should deny based on size', function(){
            expect(pcmd.make('TES')).to.be.false;
            expect(pcmd.make('TEST2')).to.be.false;
        })
    })
    describe('BENCHMARK', function(){
        this.timeout(200);
        it('should run 25000 bad tests in time', function(){
            for(i=0; i<=25000; i++){
                if(pcmd.get(makeBufferFrom(Math.random().toString(36).substring(27))) !== false) throw 'WAAA';
            }
        })
        it('should run 50000 good tests in time', function(){
            pcmd.next = ' ';
            for(i=0; i<=50000; i++){
                if(pcmd.get(makeBufferFrom('RUND RANDOM XYZ')) !== 'RUND') throw 'WAAA';
            }
        })
    })
});
