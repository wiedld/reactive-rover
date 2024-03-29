## What is this thing?

The wandering Mars Rover. Started as a coding challenge (to do OOP style). That original code lives in `src/robot/logic/logic.ts`.

Then people kept asking about react hooks. Since I had already used other attempts to cleanly manage side effects (see Approach #1 below), I understood the need and therefore decided to play with hooks.

### To run:

Frontend only interactivity:
1. Be in client dir.
2. `npm i`
3. `npm run build:dev`
4. `npm run start:dev`
5. Has hot reloading.


## Managing a centralized source of truth

This repo is an experiment in managing state without a centralized source (e.g. without redux), and using only react hooks. Here is a a quick recap of my current biases/experiences/IMHO-could-be-wrong when it comes to managing a centralized state tree (e.g. redux).

* Redux action creators are a great or terrible thing. Depends on use.

* Thunks are about microtasks (async/await), which can block up the event loop.

* If you play it loose with the thunking and action creators, you may create some unexpected serialization of state updates. And/or slow down your app.

* Generators and function calls hit the macrotask queue (JS event loop). Therefore, non-blocking.

* Redux-sagas is a state management lib that forces you to use mostly macrotasks, but require that you conceptualize state management based on atomicity. You start with a series of interconnected tasks which manage state. Break up these tasks into units, based upon what state updates can be rolled back (i.e. application of an inverse change). Then each task may be called concurrently. Set watchers (and error handlers), such that when one of the tasks fail, the interconnected tasks are rolled back. In this way state management is clean without serialization required in how state changes hit the centralized store, or in how you write your code. Background on sagas: https://redux-saga.js.org/docs/introduction/SagaBackground.html (Note: redux-sagas also use the abstracted concepts fork, spawn, etc.)

* All of the above is about state management over a centralized source of truth in your frontend. How about the state management across the DOM, with react hooks, without the state centralization? (See approach #2 below. Experimentation is my friend.)


## Managing state and its side effects on the DOM

A few ways to manage state (not exhuastive).

### Approach #1: Redux as a central source of truth

Pre-hook world traditionally used a centralized tree (e.g. redux). All unidirection flow from this tree (into the unidirection react rendering) could be done as follows:

1. Selectors in mapStateToProps, which directly accesses the redux centralized state.

2. Using react PureComponent class or functional components, using all state as derived from props.

3. Re-rendering was therefore limited to any changes in props only (and state derived from props). Therefore, the internal state *should* never get out of sync with the centralized redux source.

This ^^ was my previous go-to method. (Plus being careful of 3rd party UI libs with internal state.)


### Approach #2: Managing all state through react hooks (no centralization)

Key concepts to keep in mind:

1. Re-using the same hook will share state logic, not state itself.

2. When a component is mounted (note this is different from updating), then the React hook will be initialized. On initialization, the hook sets an initial state. This init state may be broadcasted via a PubSub.

3. When a component is re-mounted due to a parent re-rendering, then the hook will be re-created. InitState will be set again. Broadcast sent again.

4. Be very intentionally aware of hook shared state, and when a hook inits (and re-inits).
    * If you are putting hooks inside a descendent component that is mounted based on a list (e.g. <kbd style="color:grey;">`values.map((v,idx) => <MyComponent key={idx} {...v} />)`</kbd>) you may end up re-mounting components unintentionally, thereby re-triggering the hook state init.

5. Entirely separated hook states may impact each other using PubSub. This is a useful design feature, but can be tricky if abused.

6. The hook state, and the corresponding PubSubs, only exist after the component is mounted.
    * Warning: hooks are mounted (and initialized) in a tree format, matching your React tree abstract. This means that there is an ordering to hook initialization, and any associated PubSub broadcasting events.
    * If a publishing React node is initialized before the subscribing React node, the subscriber will never get the initializing broadcasted value.
    * So your PubSub graph may have missing nodes, at a given timepoint, due to a race condition with React tree renders.

7. The React component lifecycle is based on a series of declarations. (What to do when.) The React hook replaces these declarations, but you need to make sure to:
    * utilize the <kbd style="color:grey;">useEffect()</kbd> hook with the <kbd style="color:grey;">cleanup()</kbd> function, to handle mounting and unmounting.
    * be mindful to avoid PubSub network cycles.
    * keep in mind that the hook state changes will trigger a re-render in the components in which they are used, whenever the state changes (e.g. by a PubSub event).
    * as such, the react render tree + the PubSub graph connections may themselves create a cycle. (See earlier example.)

8. If you are managing hook state via a PubSub network, then I recommend figuring out your dependency flow for the state first before dev'ing.
    * Basically, design your PubSub graph as a directed tree to avoid any cycles.
    * e.g. PubSub update order: <kbd style="color:grey;">`World → Continents → Countries → Communities → Person`</kbd>
    * Then keep in mind this dependency chain when building the hooks and their PubSub connections.
    * Don’t make a graph. Instead, tie your PubSub state tree in the same direction as your React view tree.

9. Try to avoid having more than one interconnected (PubSub connected) hook per component.


Overall, using only state in react hooks + PubSub (without any centralized store) was an interesting concept. The benefits are: (1) use macrotasks (not microtacks) to avoid event loop blockage, (2) to enforce state remains external to render components, and (3) set your state updates as independent watchers (i.e. PubSub and `useEffect()`).

The biggest complexity that is introduced, (if using only PubSub to manage state connections), is keeping in mind both the react DOM tree and the PubSub graph.


## Design choices

Dependency flow = `World -> Robots -> Robot -> UiRobot`:

* world size decided by user. then randomly populate world with hazards.

* new world -> all robots wiped.

* do not want all robots re-rendering (by setting hook state) whenever a single robot changed.

* as much as possible, only re-render the one active robot. then deactivate when creating a new robot (but leave in the DOM).

* deactivated robots become additional hazards.

* when moving, if a robot encounters a hazard -- then it moves back to the last position without a hazard. If the hazard is not on the end goal (location coordinates), then the robot may keep trying to find a path. (This means that it will wander over more of the world.)

* kept the classes Robot and World intact (original coding challenge), with only two minor changes.

* &#9829; wall-e

* free icons sourced from: https://www.flaticon.com/authors/vitaly-gorbachev and https://dribbble.com/iblowyourdesign 


## TODO:
* rover releases an error code when it cannot reach destination (because hazards etc). pipe into the UI. (decide where.)
* used strict settings in the tsconfig. But that means I have 11 instances of `// @ts-ignore`. Most are from my use of DRY (e.g. the PubSub, RobotType vs UIRobotType), which don't play well with typescript mixins + union types. Are fixable...will get around to it.
* build out node.js server

