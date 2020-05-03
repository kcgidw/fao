<template>
	<div id="home" class="view">
		<div class="view-container">
			<div id="title-banner" class="stripe align-center">
				<div class="stripe-content">
					<h1 class="title">Fake Artist Online</h1>
				</div>
			</div>
			<div class="stripe flex-center">
				<home-menu></home-menu>
			</div>
			<div class="stripe">
				<div id="about-content" class="stripe-content normal-text align-center">
					<p>
						Fake Artist Online is a drawing game based on Oink Games' tabletop game,
						<a href="https://oinkgms.com/en/a-fake-artist-goes-to-new-york"
							>A Fake Artist Goes to New York</a
						>.
					</p>
					<p>
						Contribute:
						<a href="https://github.com/kcgidw/fao">Github</a>
					</p>
					<p>
						Enjoy the game? Send a tip:
						<a href="https://ko-fi.com/krackocloud">Ko-fi</a>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import HomeMenu from './home-menu';
export default {
	name: 'HomeView',
	components: {
		HomeMenu,
	},
};
</script>
