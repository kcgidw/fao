<template>
	<div id="rules" class="view">
		<div class="view-container">
			<div class="stripe">
				<div id="rules-content" class="stripe-content normal-text">
					<div class="align-left">
						<h2>Rules</h2>
					</div>
					<div class="align-left">
						<p>
							A group of players must work together to find the one
							<strong>fake artist</strong> among them, while that player tries to
							avoid detection.
						</p>
						<p>
							Each round, players see the round's random keyword and its category,
							e.g. <span>"Food: Apple".</span>
						</p>
						<p>
							But the fake artist <em>only</em> sees the category, e.g. "Food: ???".
						</p>
						<p>
							Players take turns drawing single strokes on a drawing pad. After
							everyone has drawn twice, everyone votes on who they think the fake
							artist is.
						</p>
						<p>
							The fake artist wins if they don't get the majority vote.
						</p>
						<p>
							But even if the fake artist gets caught, they get one chance to guess
							the keyword. If they guess correctly, <em>they still win!</em>
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
import Store from './state';
import VIEW from './view';
export default {
	name: 'RulesView',
	methods: {
		back() {
			Store.setView(Store.state.previousView);
		},
	},
};
</script>
