<template>
	<div id="rules" class="view">
		<div class="view-container">
			<div class="stripe flex-center">
				<div id="rules-content" class="stripe-content normal-text">
					<div class="align-center">
						<h2>Rules</h2>
					</div>
					<div class="align-left">
						<p>A group of players must work together to find the one <strong>fake artist</strong> among them, while that person tries to avoid detection.</p>
						<p>Each round, all players see the randomly-chosen keyword and its hint/category, e.g. <span>"Apple (Food)".</span></p>
						<p>But the fake artist <em>only receives the hint</em>.</p>
						<p>Players take turns drawing single strokes on a drawing pad. After every player has drawn twice, everyone votes on who they think the fake artist is.</p>
						<p>The fake artist has to bluff their way through the drawing. The others want to prove they know the keyword - but draw too obviously, and the fake artist might catch on!</p>
						<p>If the fake artist is caught, they get a chance to guess the keyword. If they're correct, <em>they still win!</em></p>
					</div>
					<div class="align-center">
						<button class="btn tertiary" @click="back()">Back</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
const Store = require('./state');
const VIEW = require('./view');
export default {
	name: 'RulesView',
	methods: {
		back() {
			Store.setView(Store.state.previousView);
		}
	},
};
</script>
