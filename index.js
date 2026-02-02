Hooks.on('ready', function () {
   console.log("Initializing Module escape-window")

   // redirect the active escape key binding with our own. It's based on Clientkeybindings.#onDismiss, but with our improvements
   let binding = game.keybindings.activeKeys.get("Escape").find(_ => _.action === "core.dismiss")
   if (binding) {
      binding.onDown = async (context) => {


         // Cancel current drag workflow
         if (canvas.currentMouseManager) {
            canvas.currentMouseManager.interactionData.cancelled = true;
            canvas.currentMouseManager.cancel();
            return true;
         }

         // Save fog of war if there are pending changes
         if (canvas.ready) canvas.fog.commit();

         // Case 1 - close the main menu
         if (ui.menu?.rendered) {
            await ui.menu.toggle();
            return true;
         }

         // Case 2 - dismiss an open context menu
         if (ui.context?.element) {
            await ui.context.close();
            return true;
         }

         // Case 3 - dismiss an open Tour
         if (foundry.nue.Tour.tourInProgress) {
            foundry.nue.Tour.activeTour.exit();
            return true;
         }

         // Case 4 - close open UI windows
         // note - maximize() and minimize() claim to be promises, but do not act as promises
         let changed = false;
         for (const app of Object.values(ui.windows)) {
            // toggle the minimization state of the window.
            if (true && app.minimized) {
               app.maximize()
               changed = true
            } else {
               app.minimize()
               changed = true
            }
         }
         for (const app of foundry.applications.instances.values()) {
            if (app.hasFrame) {
               // toggle the minimization state of the window.
               if (true && app.minimized) {
                  app.maximize()
                  changed = true
               } else {
                  app.minimize()
                  changed = true
               }
            }
         }

         if (changed) return true;

         // Case 5 (GM) - release controlled objects (if not in a preview)
         if (game.view !== "game") return false;
         const layer = canvas.activeLayer;
         if (layer instanceof foundry.canvas.layers.InteractionLayer) {
            if (layer._onDismissKey(context.event)) return true;
         }

         // Case 6 - open the main menu
         ui.menu.toggle();
         // Save the fog immediately rather than waiting for the 3s debounced save as part of commitFog.
         if (canvas.ready) await canvas.fog.save();
         return true;
      }
   }



   // // override the default on dismiss behavior
   // ClientKeybindings.#onDismiss = context => {
   //    // Save fog of war if there are pending changes
   //    if (canvas.ready) canvas.fog.commit();

   //    // Case 1 - dismiss an open context menu
   //    if (ui.context && ui.context.menu.length) {
   //       ui.context.close();
   //       return true;
   //    }

   //    // Case 2 - dismiss an open Tour
   //    if (Tour.tourInProgress) {
   //       Tour.activeTour.exit();
   //       return true;
   //    }

   //    // Case 3 - minimize open UI windows
   //    if (Object.values(ui.windows).some(w => !w._minimized)) {
   //       Object.values(ui.windows).forEach(app => {
   //          if (app.options.minimizable)
   //             app.minimize();
   //       });
   //       return true;
   //    }

   //    // Case 4 (GM) - release controlled objects (if not in a preview)
   //    if (game.user.isGM && canvas.activeLayer && canvas.activeLayer.controlled.length) {
   //       if (!canvas.activeLayer.preview?.children.length) canvas.activeLayer.releaseAll();
   //       return true;
   //    }

   //    // Case 5 - toggle the main menu
   //    ui.menu.toggle();
   //    // Save the fog immediately rather than waiting for the 3s debounced save as part of commitFog.
   //    if (canvas.ready) canvas.fog.save();
   //    return true;
   // }
})

