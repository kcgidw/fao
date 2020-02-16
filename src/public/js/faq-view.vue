<template>
	<div id="faq" class="view">
		<div class="view-container">
			<div class="stripe">
				<div id="faq-content" class="stripe-content normal-text">
					<div class="align-left">
						<h2>About / FAQ</h2>
					</div>
					<div class="align-left">
						<strong>I found a bug!</strong>
						<p>
							Bug reports are greatly appreciated! Contact:<em>fakeartistonline@gmail.com</em>
						</p>
						<strong>I accidentally quit my browser. Can I rejoin an in-progress game?</strong>
						<p>This is on the to-do list!</p>
						<strong>Will you implement ___?</strong>
						<p>FAO is meant to be fairly simple and adaptable for house rules, so I'm not ambitious.</p>
						<p>Still, I'm open to suggestions. Reach me with the email above.</p>
						<strong>Can I contribute to FAO?</strong>
						<p>
							<a href="https://github.com/kcgidw/fao">Github repo here</a>, with more details on
							contributing.
						</p>
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
import Store from "./state";
import VIEW from "./view";
export default {
	name: "RulesView",
	methods: {
		back() {
			Store.setView(VIEW.HOME);
			// this.$router.push(VIEW.HOME);
		}
	}
};
</script>
