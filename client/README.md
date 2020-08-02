## What is this thing?

The wandering Mars Rover. Started as a coding challenge (to do OOP style). That original code lives in `src/robot/logic/logic.ts`.

Then people kept asking about react hooks. Since I had already used other attempts to cleanly manage side effects (see Approach #1 below), understand the need, and therefore decided to play with hooks.


## Managing a centralized source of truth

This repo is an experiment in managing state without a centralized source. (See next section.) Here is a a quick recap of my current biases/experiences/IMHO-could-be-wrong when it comes to managing a centralized state tree (e.g. redux).

* redux action creators are a great or terrible thing. Depends on use.

* thunks are about microtasks (async/await), which can block up the event loop.

* if you play it loose with the thunking and action creators, you may create some unexpected serialization of state updates.

* redux-sagas force you to use mostly macrotasks, but then you need to carefully manage the atomicity. e.g. make atomic transactions/actions in your state management, which have the ability to be reversible if things go wrong. (And make sure you build watchers for when things go wrong.) Your ability to make the state changes be reversible, is a key factor for not needing serialization of your sagas (thereby allowing you to use macrotask-producing generators). Background on sagas: https://redux-saga.js.org/docs/introduction/SagaBackground.html

* All of the above is about state management over a centralized source of truth in your frontend. How about the state management across the DOM? And other ways to think about it (without the state centralization)?


## Managing state in the DOM

First time using react hooks. It seems that there are a few key concepts to keep in mind when planning for state management.

#### Approach #1: Redux as a central source of truth

Pre-hook world traditionally used a centralized redux tree, and all unidirection flow from this tree (into the unidirection react rendering) could be done as follows:

1. selectors in mapStateToProps, which directly accesses the redux centralized state.

2. using react class PureComponents or functional components, using all state as derived from props.

3. re-rendering was therefore limited to any changes in props only (and state derived from props). Therefore, the internal state *should* never get out of sync with the centralized redux source.

This ^^ was my previous go-to method. (Plus being careful of 3rd party UI libs with internal state.)


#### Approach #2: Managing all state through react hooks (no centralization).

Key concepts to keep in mind:

1. re-using the same hook will share state.

2. when a component is re-rendered due to a parent re-rendering, then the hook will reset to initial state.

3. the hook states may impact each other using PubSub (see react docs).

4. but the hook state, and the corresponding PubSubs, only exist after the component is initialized.

5. as such, if you try for any interconnectiveness between hook states (using PubSub) you need to keep in mind the react rendering dependencies. (e.g. what state hook -- and it's PubSub actions -- are further down the tree and may not exist yet).

6. you have no control over re-renders (a.k.a. the react abstraction), which is why it's important to:
    * utilize the useEffect() hook with the cleanup() function.
    * be mindful to avoid PubSub cycles. (yeah duh.)
    * keep in mind that the hook state changes will trigger a re-render in the components in which they are used, whenever the state changes (e.g. by a PubSub event).
    * as such, the react render tree + the PubSub connections may themselves create a cycle. (okay...I feel dumb now. oops.)

7. I recomend figuring out your dependency flow for the state first before dev'ing (e.g. mine was `World -> Robots -> Robot -> UiRobot`). Then have the react tree and PubSub dependencies (with react hooks) follow this plan. And try to avoid having more than one interconnected (PubSub connected) hook per component.

Overall, using only state in react hooks + PubSub (without a centralized store) was an interesting concept. Not sure how individual teams team would use. Decide for yourselves how/when to use hooks.



#### Approach #3: Managing state with react hooks connected to a centralized redux tree.

I haven't done this one yet. Have some (correct? incorrect? confused?) opinions on how this approach will work out.


## Design choices

Dependency flow = `World -> Robots -> Robot -> UiRobot`:

* world size decided by user. then randomly populate world with hazards.

* new world -> all robots wiped.

* do not want all robots re-rendering (by setting hook state) whenever a single robot changed.

* as much as possible, only re-render the one active robot. then deactivate when creating a new robot (but leave in the DOM).

* deactivated robots become additional hazards.

* when moving, if a robot encounters a hazard -- then it moves back to the last position without a hazard. If the hazard is not on the end goal (location coordinates), then the robot may keep trying to find a path.

* kept the classes Robot and World intact (original coding challenge), with only two minor changes.

* &#9829; wall-e

* free icons sourced from: https://www.flaticon.com/authors/vitaly-gorbachev and https://dribbble.com/iblowyourdesign 

