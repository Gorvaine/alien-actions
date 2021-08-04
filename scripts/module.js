Hooks.once('init', async function () {

});

Hooks.once('ready', async function () {
  CONFIG.statusEffects.push({
    "id": "fastAction",
    "label": "EFFECT.StatusFastAction",
    "icon": "modules/alien-actions/assets/fast-action.svg"
  });

  CONFIG.statusEffects.push({
    "id": "slowAction",
    "label": "EFFECT.StatusSlowAction",
    "icon": "modules/alien-actions/assets/slow-action.svg"
  });
});

Hooks.on('updateCombat', async function (e) {
  let combat_token = canvas.tokens.get(e.current.tokenId);
  let combat_actor = combat_token.actor;

  if (e.current.turn == 0) { // if we are in first turn
    //e.combatants.forEach(combatant => {      
    //  canvas.tokens.children[0].children.filter(token => token.data.name == combatant.name).forEach(token => removeActions(token) );
    
    // WE ACTIVATE ALL CANVAS TOKENS!
    canvas.tokens.children[0].children.forEach(token => removeActions(token));
    
  }

  // IF it's a creature with speed > 1 we activate token again.
  if (combat_actor.type == "creature") { // if its a creature
    if (combat_actor.data.data.attributes.speed.value > 1) {
      removeActions(combat_token);
    }
  }
});


// Clear actions when combat ends.
Hooks.on('deleteCombat', async function (e) {
  canvas.tokens.children[0].children.forEach(token => removeActions(token));
});

async function removeActions(combat_token) {

  let slowAction = combat_token.actor.effects.find(eff => eff.getFlag("core", "statusId") === "slowAction");
  let fastAction = combat_token.actor.effects.find(eff => eff.getFlag("core", "statusId") === "fastAction");

  if (slowAction != undefined) await slowAction.delete();
  if (fastAction != undefined) await fastAction.delete();

};
