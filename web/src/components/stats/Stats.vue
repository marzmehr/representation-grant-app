<template>
    <div style="margin: bottom 2.5em;">
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
            "FormP1",
            "FormP1 Created Date",
            "FormP1 Last Updated",
            "FormP9",
            "FormP9 Created Date",
            "FormP9 Last Updated"
        ];
        const overview_fields = [
            "Total Applications",
            "Total FormP1s",
            "Total FormP9s"
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