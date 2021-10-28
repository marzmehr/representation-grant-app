<template>
    <b-card class="container" id="terms" border-variant="white">
        <b-row class="mt-3">
            <b-col>
				<span class="text-primary h1 ml-4">Terms and Conditions</span>
				<b-card border-variant="white">
                    
					<p>"Apply to Represent Someone Who Died" is a service provided by the Government of British Columbia.</p>
					<p>The Government of British Columbia has the right to change this service at any time.</p>
					<ul>
						<li>Learn more about the disclaimer and liability 
							<a target="_blank" href="https://www2.gov.bc.ca/gov/content/home/disclaimer">here
							</a>.
						</li>
						<li>Learn more about privacy and security 
							<a target="_blank" href="https://www2.gov.bc.ca/gov/content/home/privacy">here
							</a>.
						</li>                
					</ul>

					
					<p>The Supreme Court of British Columbia will review your <tooltip :index="0" title='application'/>. 
					The Court will decide to give you a <tooltip :index="0" title='Representation Grant'/> or not.
					</p>
				</b-card>
				<b-button variant="primary" class="ml-4" style="font-size:22px;font-weight:bold;" size="lg" @click="navigate()">Accept</b-button>
               
            </b-col>
        </b-row>
		
    </b-card>
</template>

<script lang="ts">
import { Component, Vue} from 'vue-property-decorator';
import Tooltip from "@/components/survey/components/Tooltip.vue";

@Component({
    components:{
        Tooltip
    }
})
export default class terms extends Vue {

	public navigate() {
        
        this.$router.push({ name: "applicant-status" });
         
    }

  
};
</script>

<style scoped lang="scss">
@import "src/styles/common";
.home-content {
  padding-bottom: 20px;
  padding-top: 2rem;
  max-width: 950px;
  color: black;
}

</style>
