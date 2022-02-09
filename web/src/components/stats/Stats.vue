<template>
    <div v-if="overview && stats">
        <b-table
            hover
            head-variant="dark"
            :items="overview"
            :fields="overview_fields"
            style="white-space: pre-line;"
        >
        </b-table>
        <b-table
            hover
            head-variant="dark"
            :items="stats"
            :fields="stats_fields"
            style="white-space: pre-line;"
        >
        </b-table>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import { SurveyDataService } from "@/services/survey-data-service";

export default defineComponent({
    name: "stats",
    setup() {
        let stats = ref();
        let overview = ref();
        const stats_fields = [
            "ID",
            "Form P1",
            "P1 Created Date",
            "Form P9",
            "P9 Created Date"
        ];
        const overview_fields = [
            "Total Applications",
            "Total P1s",
            "Total P9s"
        ];

        async function getStats() {
            let response;
            try {
                response = await SurveyDataService.stats();
            } catch(err) {
                console.log("Error: Could not get stats", err);
            }

            if (response) {
                // overview stats are the last item in the list
                overview.value = response.splice(-1);
                stats.value = response;
            }
        }

        getStats();

        return {
            stats_fields,
            stats,
            overview_fields,
            overview
        };
    }
});
</script>