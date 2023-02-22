import { ButtonInteraction } from "discord.js";
import { InteractionModule } from "../../types";
import { ruokaaInteraction } from "../../utils/interactionUtils";

const interaction: InteractionModule = {
    data: {
        name: "ruokaa-skinnarila",
    },
    async execute(interaction: ButtonInteraction) {
        await ruokaaInteraction(interaction);
    },
};

export default interaction;
