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
							<h3>I found a bug!</h3>
							<p>
								Bug reports are greatly appreciated! Contact:
								<em>fakeartistonline@gmail.com</em>
							</p>
							<h3>
								I accidentally quit my browser. Can I rejoin an in-progress game?
							</h3>
							<p>This is on the to-do list!</p>
						</div>
						<div class="qa">
							<h3>Will you implement ___?</h3>
							<p>
								FAO is meant to be fairly simple and adaptable for house rules, so
								I'm not ambitious. Still, I'm open to suggestions. Reach me with the
								email above.
							</p>
						</div>
						<div class="qa">
							<h3>Can I contribute to FAO?</h3>
							<p>
								<a href="https://github.com/kcgidw/fao">Github repo here</a>, with
								more details on contributing.
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
