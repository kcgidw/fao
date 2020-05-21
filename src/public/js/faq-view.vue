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
							<h3>The site is slow / The site went down!</h3>
							<p>
								FAO's currently on Heroku's free hosting service, which has its
								limitations. One day I'd like to set up a proper server and domain!
							</p>
							<p>
								I also sometimes push updates, usually Mon/Tue, which causes server
								maintenance. Apologies in advance!
							</p>
						</div>
						<div class="qa">
							<h3>I found a bug!</h3>
							<p>
								I appreciate bug reports! Post an issue on Github, or contact me at
								<em>fakeartistonline@gmail.com</em>.
							</p>
						</div>
						<div class="qa">
							<h3>Will you implement ___?</h3>
							<p>
								FAO is meant to be fairly simple and adaptable for house rules, so
								I'm not super ambitious. Still, I'm open to suggestions. Make a
								request on Github, or reach me with the email above.
							</p>
						</div>
						<div class="qa">
							<h3>Misc. about</h3>
							<p>FAO is not affiliated with Oink Games.</p>
							<p>
								Notification SFX from
								<a href="https://material.io/design/sound/sound-resources.html"></a>
								(<a href="https://creativecommons.org/licenses/by/4.0/">CC-BY 4.0</a
								>)
							</p>
							<p>
								This is a one-man pet project, so I appreciate your patience for
								fixes and features.
							</p>
							<p>
								Also, this should go without saying, but please play with a modern
								browser!
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
		},
	},
};
</script>
