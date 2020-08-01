import { v4 as uuidv4 } from 'uuid';
import { Command, Direction, Location, World } from '../../global-types';
import PhysicalWorld from '../../world';

const STATUS_CODES = ['OK', 'OBSTACLE', 'INVALID_COMMAND'];

function sleep(milliseconds: number) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

export interface Props {
    physicalWorld: PhysicalWorld;
    location: Location;
    direction: Direction;
}

class Robot {
    static ObstacleException = 1;
    static InvalidCmdException = 2;
    static InvalidWorldUpdate = "Robot is located off the new world map";

    // ordered for mod math (rotating robot)
    static orderedDir: Array<Direction> = [
        'N',
        'E',
        'S',
        'W'
    ];

    static isKnownWorld ([x,y]: Location, knownWorld: World) {
        return !!knownWorld[y] && !!knownWorld[y][x];
    }

    id: string;
    _location: Location;
    _direction: number;
    _commands: Array<Command>;
    _physicalWorld: PhysicalWorld;

    setLocation (loc: Location) {
        this._physicalWorld.removeLocation(this._location);
        this._physicalWorld.setLocation(loc);
        this._location = loc;
    }
    get location () { return this._location; }

    setDirection (dir: number) { this._direction = dir; }
    get direction () { return Robot.orderedDir[this._direction]; }
    get numericDirection () { return this._direction; }

    addCommand (c: Command) { this._commands.push(c); }
    addCommands (cs: Array<Command>) { this._commands.push(...cs); }
    get commands () { return this._commands; }

    setWorld (w: PhysicalWorld) {
        const [x,y]: Location = this._location;
        if (!!w.worldMap[y] && !!w.worldMap[y][x]) {
            this._physicalWorld = w;
            return true;
        }
        throw Robot.InvalidWorldUpdate;
    }

    constructor ({ physicalWorld, location, direction }: Props) {
        this._commands = [];
        this._physicalWorld = physicalWorld;
        this._physicalWorld.setLocation(location);
        this._location = location;
        this._direction = Robot.orderedDir.indexOf(direction);
        this.id = uuidv4();
    }

    command (commands: Array<Command>) {
        try {
            commands.forEach(cmd => this._move(cmd));
            return this._status(0);
        } catch (e) {
            return this._status(e);
        }
    }

    _move (cmd: Command) {
        this.addCommand(cmd);

        const mvtAlongXaxis = (cmd: Command) =>
            (cmd == 'F' && this.direction == 'W') || (cmd == 'B' && this.direction == 'E')
                ? - 1
                : + 1;
        
        const mvtAlongYaxis = (cmd: Command) =>
            (cmd == 'F' && this.direction == 'N') || (cmd == 'B' && this.direction == 'S')
                ? - 1
                : 1;

        switch (cmd) {
            case 'L':
                this.setDirection(this._direction == 0 ? 3 : this._direction - 1);
                break;
            case 'R':
                this.setDirection((this._direction + 1) % 4);
                break;
            case 'F':
            case 'B':
                let [x,y] = this.location;
                if (['W', 'E'].includes(this.direction)) {
                    x = x + mvtAlongXaxis(cmd);
                } else {
                    y = y + mvtAlongYaxis(cmd);
                }
                this.setLocation([x,y]);
                break;
            default:
                throw Robot.InvalidCmdException;
        }
        this._assessOutcome(cmd);
    }

    _assessOutcome (cmd: Command) {
        const reverseCmd: {[cmd: string]: Command } = {
            'L': 'R',
            'R': 'L',
            'F': 'B',
            'B': 'F'
        };
        const loc = this.location;
        if (this._physicalWorld.isOffWorld(loc) || this._physicalWorld.isObstacle(loc, loc)) {
            // Note: could input a special error code into commands (history)
            this._move(reverseCmd[cmd]);
            throw Robot.ObstacleException;
        }
    }

    _status (status: number) {
        return {
            dir: this.direction,
            loc: [...this.location],
            status: STATUS_CODES[status]
        };
    }

    /*
        Use cases:
            - pre-planning:
                - when already aware of the terrian map.
                    --> nextTileOkay() can lookahead at the terrian.
                - plan optimal path first. then move.
            - physical exploration:
                - when unaware of terrian.
                    --> nextTileOkay() only knows the edge of the world.
                - note: physical exploration will backtrack over known terrian
                    --> recursive call to the pre-planning path.
    */
    moveTo (location: Location, prePlan = false, cb = (a:Robot)=>{}, knownWorld = this._physicalWorld.worldMap) {
        try {
            if (prePlan) {
                this.command(this._buildPlan(location, knownWorld))
            } else
                this._physicalExploration(location, cb);

            return this._status(0);
        } catch (e) {
            return this._status(e);
        }     
    }

    /*
        Takes:
            - goalLoc [x,y]
            - knownWorld (known terrian map)
        Returns:
            - an array of directions [N, W, W, S, S]
    */
    _buildPlan (goalLoc: Location, knownWorld: World): Array<Command> {
        const nextTileIsOkay = (loc: Location) => Robot.isKnownWorld(loc, knownWorld)
            && !this._physicalWorld.isOffWorld(loc)
            && !this._physicalWorld.isObstacle(loc, this.location);

        const planningOnly = true;

        return this._aStar(goalLoc, nextTileIsOkay, planningOnly);
    }

    /*
        Takes:
            - goalLoc [x,y]
        Returns:
            - true
    */
    _physicalExploration (goalLoc: Location, cb: (r: Robot) => void) {
        // only know size of world.
        const nextTileIsOkay = (loc: Location) => !this._physicalWorld.isOffWorld(loc);

        return this._aStar(goalLoc, nextTileIsOkay, false, cb);
    }

    /*
        Implement version of A*.
            - common algorithmic function used by planning & exploration.
        Takes:
            - `goal` target location.
            - `planningOnly` bool, determines if rover moves after each planning step.
            - `nextTileOkay` function, restricts what parts of the world can be planned.
        Returns:
            - an array of directions [N, W, W, S, S], or bool true.
        
        Caveat:
            - not a proper A* in terms of big O,
                because the lookup into the toVisit is not a single priority queue (keyed by cost).
            - since we are re-using the same aStar algorithm in BOTH physical exploration & pre-planning,
                we need to consider the different costs in backtracking.
            - to make a real AStar:
                    - `toVisit` would be a priority queue
                    - the `calcCost()` func would produce the key/cost used in the prio queue
    */
    _aStar (goal: Location, nextTileIsOkay: (x: Location) => boolean, planningOnly: boolean, cb: (r: Robot) => void = ()=>{}) {
        // Array<Array<typeof visitedNode>>
        const visited: Array<Array<typeof visitedNode>> = [...Array(this._physicalWorld.worldMap.length)]
            .map(_ => Array(this._physicalWorld.worldMap[0].length));

        // cost gets stringified (on key creation)
        const toVisit: {[cost: string]: Array<Location> } = {}; // will be keyed by [estimatedCostToGoal]

        const notYetVisited = ([x,y]: Location) => visited[y][x] == undefined;
        const estimateBtwnLoc = ([x,y]: Location, [x1,y1]: Location) => Math.abs(x1-x) + Math.abs(y1-y);
        
        // start node
        let loc: Location = this.location;
        let [x,y] = loc;
        let cost = estimateBtwnLoc([x,y], goal);

        // visited
        const visitedNode: { cost: number, path: Array<Command>, dir: Direction }
            = { cost, path: [], dir: this.direction };
        visited[y][x] = visitedNode;

        // toVisit
        toVisit[cost] = [loc];

        let curr: typeof visitedNode;
        let currDir: Direction;

        while (estimateBtwnLoc(loc, goal) !== 0) {
            curr = visited[y][x];
            currDir = planningOnly ? visited[y][x].dir : this.direction;

            const makeNext = (locN: Location, dir: Direction) => {
                if (nextTileIsOkay(locN)) {
                        let [x,y] = locN;

                        if (notYetVisited(locN)) {
                            const cost = estimateBtwnLoc(locN, goal);
                            const { dir: resultDir, cmds } = this._convertDirToCmd([dir], currDir);

                            visited[y][x] = { cost, dir: resultDir, path: curr.path.concat(cmds) };
                            toVisit[cost] = toVisit.hasOwnProperty(cost)
                                ? toVisit[cost].concat([locN])
                                : [locN];
                        }
                }
            };
            // calc N
            makeNext([x,y-1], 'N');
            // calc S
            makeNext([x,y+1], 'S');
            // calc W
            makeNext([x-1,y], 'W');
            // calc E
            makeNext([x+1,y], 'E');

            // pick next move based on:
            //      - edge-cost = est cost to move (e.g. backtracking)
            //      - g-cost = already traveled node cost = path length on next node.
            //      - h-cost = next node cost = est distance to goal (of next node). i.e. benefit gained.
            const calcCost = (nodeLoc: Location, currLoc: Location): number => {
                // geo distances
                const estimateBtwnLoc = ([x,y]: Location, [x1,y1]: Location) => Math.abs(x1-x) + Math.abs(y1-y);
                const nodeToGoal = estimateBtwnLoc(nodeLoc, goal);
                const currToNode = estimateBtwnLoc(currLoc, nodeLoc);
                const startToNode = visited[y][x].path.length;

                // weights
                const e = 1;
                const g = planningOnly ? 1 : 0;
                const h = 1;

                return e * currToNode + g * startToNode + h * nodeToGoal;
            };

            const pickMin = (): Location | null => {
                const options = Object.keys(toVisit);
                if (options.length == 0) return null;

                const toFind: { minCost: number, toVisitKey: string | null, nextLoc: Location | null }
                     = { minCost: Infinity, toVisitKey: null, nextLoc: null };

                const { toVisitKey, nextLoc } = options.sort((a,b) => a < b ? -1 : 1)
                    .reduce((acc, nodeToGoal) => {
                        toVisit[nodeToGoal].forEach(locN => {
                            let [x,y] = locN;
                            const totalCost = calcCost(locN, loc);
                            if (acc.minCost > totalCost) {
                                acc.minCost = totalCost;
                                acc.nextLoc = locN;
                                acc.toVisitKey = nodeToGoal;
                            }
                        });
                        return acc;
                    }, toFind);
                
                if (!toVisitKey || !nextLoc) return null;

                // remove node from toVisit
                toVisit[toVisitKey] = toVisit[toVisitKey].filter(l => l !== nextLoc);
                if (toVisit[toVisitKey].length == 0)
                    delete toVisit[toVisitKey];

                return nextLoc;
            };
            let next = pickMin();

            // no solution
            if (!next)
                throw Robot.InvalidCmdException;
            else
                loc = next;

            // if planning only, do not move Robot.
            if (!planningOnly) {
                // @ts-ignore
                this.moveTo(loc, true, cb, visited);
                loc = this.location;
                cb(this);
                console.log("MOVED", loc)
            }

            x = loc[0];
            y = loc[1];
        }
        return planningOnly ? visited[y][x].path : [];
    }

    /*  Takes:
            - an array of directions [N,W,E,S,E,E]
            - a starting direction
        Returns:
            - an object: {
                cmd: array of rover commands,
                dir: final direction   
            }
    */
    _convertDirToCmd (directions: Array<Direction>, startDir = this.direction) {
        const cmds: Array<Command> = [];

        return [directions.reduce(({dir, ...acc}, d) => {
            const goal: number = Robot.orderedDir.indexOf(d);
            const cmds: Array<Command> = [];

            // rotate
            while (dir !== goal) {
                if (dir < goal) {
                    cmds.push('R');
                    dir++;
                } else {
                    cmds.push('L');
                    dir--;
                }
            }
            // advance
            cmds.push('F');

            return {
                dir,
                cmds: acc.cmds.concat(cmds)
            };
        }, { dir: Robot.orderedDir.indexOf(startDir), cmds })]
        .map(x => ({ ...x, dir: Robot.orderedDir[x.dir] }))[0];
    }
}

export default Robot;
