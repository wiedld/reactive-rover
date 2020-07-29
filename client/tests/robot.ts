// @ts-nocheck
import mocha from "mocha";
import { expect } from "chai";
import Robot from "../src/robot/logic";
import PhysicalWorld from '../src/world';
import { WORLD as TestWorld } from './fixtures';

describe('Mars Robot', function() {
    let rover1 = null, rover2 = null, rover3 = null;
    let world;
    beforeEach(function() {
      world = new PhysicalWorld(5,5);
      world.worldMap = TestWorld;

      rover1 = new Robot(world, [2, 2], 'N');
    });

    describe('When the Mars Robot is initialized', function() {
      it('should set the starting location', function() {
        expect(rover1.location).to.deep.equal([2, 2]);
      });
      it('should set the starting direction', function() {
        expect(rover1.direction).to.equal('N');
      });
    });
    describe('When the rover recieves commands', function() {
      it('should store the commands', function() {
        rover1.command(['F', 'F', 'B']);
        expect(rover1.commands).to.deep.equal(['F', 'F', 'B']);
      });
      it('should handle invalid commands', function() {
        const status = rover1.command(['X']);

        expect(status).to.deep.equal({
          status: 'INVALID_COMMAND',
          loc: [2, 2],
          dir: 'N'
        });
      });
    });

    describe('When the rover executes valid commands', function() {
      describe('When facing north', function() {
        describe('When moving forward', function() {
          it('should move north one tile', function() {
            const status = rover1.command(['F']);
            expect(status).to.deep.equal({
              status: 'OK',
              loc: [2, 1],
              dir: 'N'
            });
          });
        });
        describe('When moving backward', function() {
          it('should move south one tile', function() {
            const status = rover1.command(['B']);
            expect(status).to.deep.equal({
              status: 'OK',
              loc: [2, 3],
              dir: 'N'
            });
          });
        });
        describe('When turning left', function() {
          it('should be facing west', function() {
            const status = rover1.command(['L']);
            expect(status).to.deep.equal({
              status: 'OK',
              loc: [2, 2],
              dir: 'W'
            });
          });
        });
        describe('When turning right', function() {
          it('should be facing east', function() {
            const status = rover1.command(['R']);
            expect(status).to.deep.equal({
              status: 'OK',
              loc: [2, 2],
              dir: 'E'
            });
          });
        });
      });
    });

    describe('When the rover encounters obstacles', function() {
      describe('When encountering a mountain', function() {
        it('should stop and return status', function() {
          const status = rover1.command(['L', 'F']);
          expect(status).to.deep.equal({
            status: 'OBSTACLE',
            loc: [2, 2],
            dir: 'W'
          });
        });
      });
      describe('When encountering a crevasse', function() {
        it('should stop and return status', function() {
          const status = rover1.command(['F', 'F', 'R', 'F']);
          expect(status).to.deep.equal({
            status: 'OBSTACLE',
            loc: [2, 0],
            dir: 'E'
          });
        });
      })
      describe('When encountering the edge of the world', function() {
        it('should stop and return status', function() {
          const status = rover1.command(['F', 'F', 'F']);
          expect(status).to.deep.equal({
            status: 'OBSTACLE',
            loc: [2, 0],
            dir: 'N'
          });
        });
      });
    });

    describe("A* moveTo algo, with pre-planning", function () {
        it("move to NW corner", function () {
            const loc = [0,0];
            const status = rover1.moveTo(loc, true);
            // console.log("# commands:", rover1.commands.length);
            expect(status.status).to.equal('OK');
            expect(status.loc).to.deep.equal(loc);
        });
        it("move to SE corner", function () {
            const loc = [4,4];
            const status = rover1.moveTo(loc, true);
            // console.log("# commands:", rover1.commands.length);
            expect(status.status).to.equal('OK');
            expect(status.loc).to.deep.equal(loc);
        });
        it("move to SW corner", function () {
            const loc = [0,4];
            const status = rover1.moveTo(loc, true);
            // console.log("# commands:", rover1.commands.length);
            expect(status.status).to.equal('OK');
            expect(status.loc).to.deep.equal(loc);
        });
        it("move to NE corner", function () {
            const loc = [4,0];
            const status = rover1.moveTo(loc, true);
            // console.log("# commands:", rover1.commands.length);
            expect(status.status).to.equal('OK');
            expect(status.loc).to.deep.equal(loc);
        });
        it("should not move", function () {
            const loc = [2,2];
            const status = rover1.moveTo(loc, true);
            expect(status.status).to.equal('OK');
            // console.log("# commands:", rover1.commands.length);
            expect(status.loc).to.deep.equal(loc);
            expect(rover1.commands.length).to.equal(0);
        });
        it("error when not possible", function () {
            const status = rover1.moveTo([1,1], true);
            expect(status.status).to.equal('INVALID_COMMAND');
        });
    });

    describe("A* moveTo algo, WITHOUT pre-planning", function () {
        it("move to NW corner", function () {
            const loc = [0,0];
            const status = rover1.moveTo(loc);
            // console.log("# commands:", rover1.commands.length);
            expect(status.status).to.equal('OK');
            expect(status.loc).to.deep.equal(loc);
        });
        it("move to SE corner", function () {
            const loc = [4,4];
            const status = rover1.moveTo(loc);
            // console.log("# commands:", rover1.commands.length);
            expect(status.status).to.equal('OK');
            expect(status.loc).to.deep.equal(loc);
        });
        it("move to SW corner", function () {
            const loc = [0,4];
            const status = rover1.moveTo(loc);
            // console.log("# commands:", rover1.commands.length);
            expect(status.status).to.equal('OK');
            expect(status.loc).to.deep.equal(loc);
        });
        it("move to NE corner", function () {
            const loc = [4,0];
            const status = rover1.moveTo(loc);
            // console.log("# commands:", rover1.commands.length);
            expect(status.status).to.equal('OK');
            expect(status.loc).to.deep.equal(loc);
        });
        it("should not move", function () {
            const loc = [2,2];
            const status = rover1.moveTo(loc);
            // console.log("# commands:", rover1.commands.length);
            expect(status.status).to.equal('OK');
            expect(status.loc).to.deep.equal(loc);
            expect(rover1.commands.length).to.equal(0);
        });
        it("error when not possible", function () {
            const status = rover1.moveTo([1,1]);
            expect(status.status).to.equal('INVALID_COMMAND');
        });
    });

    describe("Will handle multiple Robots in the world", () => {
        beforeEach(function() {
          world = new PhysicalWorld(5,5);
          world.worldMap = TestWorld;
          rover1 = new Robot(world, [2, 2], 'N');
        });
        describe("should not error if does not encounter another rover", () => {
          it("workz", () => {
            rover1.moveTo([4,4]);

            rover2 = new Robot(world, [2, 2], 'N');
            const status = rover2.command(['F', 'F', 'B']);
            expect(status.status).to.equal('OK');
          });
      });
        describe("if encountering another rover", () => {
            it("during comand() sequence, then perform OBSTACLE error", () => {
                let cmds = ['F', 'F', 'B'];
                const status1 = rover1.command(cmds);
                expect(status1.status).to.equal('OK');

                rover2 = new Robot(world, [2, 2], 'N');
                const status2 = rover2.command(cmds.concat(['L', 'L']));
                expect(status2.status).to.equal('OBSTACLE');
            });

            it("during moveTo() planning, then perform INVALID_COMMAND error", () => {
                let loc = [4,4]
                const status1 = rover1.moveTo(loc);
                expect(status1.loc).to.deep.equal(loc);
                expect(status1.status).to.equal('OK');


                rover3 = new Robot(world, [2, 2], 'N');
                const status2 = rover3.moveTo(loc);
                expect(status2.status).to.equal('INVALID_COMMAND');
            });
        });
    });
});
