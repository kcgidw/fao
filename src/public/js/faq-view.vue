<template>
	<div id="faq" class="view">
		<div class="view-container">
			<div class="stripe">
				<div id="faq-content" class="stripe-content normal-text">
					<div class="align-left">
						<h2>About / FAQ</h2>
					</div>
					<div class="align-left">
						<div class="qa">
							<h3>
								I accidentally quit my browser. How do I rejoin an in-progress game?
							</h3>
							<p>Join the room again with your username exactly as it was.</p>
						</div>
						<div class="qa">
							<h3>The website connection is spotty!</h3>
							<p>FAO's currently on Heroku's free hosting service.</p>
							<p>(I would like to get a proper server and domain at some point!)</p>
						</div>
						<div class="qa">
							<h3>I found a bug!</h3>
							<p>
								Bug reports are greatly appreciated! Contact me at
								<em>fakeartistonline@gmail.com</em>, or post an issue on Github.
							</p>
						</div>
						<div class="qa">
							<h3>Will you implement ___?</h3>
							<p>
								FAO is meant to be fairly simple and adaptable for house rules, so
								I'm not ambitious. Still, I'm open to suggestions. Reach me with the
								email above, or make a request on Github.
							</p>
						</div>
					</div>
					<div class="align-right">
						<button class="btn secondary" @click="back()">OK</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Store from './state';
import VIEW from './view';
export default {
	name: 'RulesView',
	methods: {
		back() {
			Store.setView(VIEW.HOME);
			// this.$router.push(VIEW.HOME);
		},
	},
};
</script>
