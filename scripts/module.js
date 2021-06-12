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

  if (e.current.turn == 0) { // if we are in first round
    e.combatants.forEach(combatant => {
      //if (combatant.actor.type != "creature") removeActions(combatant.token);
      removeActions(combatant.token);
    });
  }

  if (combat_actor.type == "creature") { // if its a creature
    if (combat_actor.data.data.attributes.speed.value > 1) {
      removeActions(combat_token);
    }
  }
});

async function removeActions(combat_token) {

  let slowAction = combat_token.actor.effects.find(eff => eff.getFlag("core", "statusId") === "slowAction");
  let fastAction = combat_token.actor.effects.find(eff => eff.getFlag("core", "statusId") === "fastAction");

  if (slowAction != undefined) await slowAction.delete();
  if (fastAction != undefined) await fastAction.delete();

};