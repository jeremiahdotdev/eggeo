<script setup lang="ts">
import { randomHexColor } from '~/composables/colors/randomPastelColors';

const props = defineProps<{
  strokeWidth?: number;
  color?: string;
  id?: string;
  dimensions?: any;
  styles?: string;
  showBush?: boolean;
}>();

const seed = props.id ?? new Date().getMilliseconds().toPrecision(21);

let stop1Color: string, stop2Color: string, stop3Color: string;
if (props.color) {
  stop1Color = props.color;
  stop2Color = props.color;
  stop3Color = props.color;
} else {
  stop1Color = randomHexColor();
  stop2Color = randomHexColor();
  stop3Color = randomHexColor();

  while (stop2Color === stop1Color || stop2Color === stop3Color) {
    stop2Color = randomHexColor();
  }
}
</script>

<template>
  <svg
    :viewBox="showBush ? '-165 -90 600 400' : '0 -80 270 400'"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="#000"
    :stroke-width="strokeWidth ?? 3"
    :width="dimensions?.width"
    :height="dimensions?.height"
    :class="[styles]"
    ariaLabel="A colorful egg."
  >
    <g transform="rotate(-90, 160, 160)" :class="styles">
      <!-- Define linear gradient with modified color stops -->
      <defs>
        <linearGradient :id="`eggGradient-${seed}`" x1="0%" y1="0%" x2="100%" y2="0">
          <stop offset="0%" :stop-color="stop1Color" />
          <stop offset="30%" :stop-color="stop1Color" />
          <stop offset="35%" :stop-color="stop2Color" />
          <stop offset="60%" :stop-color="stop2Color" />
          <stop offset="70%" :stop-color="stop3Color" />
          <stop offset="100%" :stop-color="stop3Color" />
        </linearGradient>
      </defs>
      <!-- Egg with gradient fill (rotated -90 degrees) -->
      <path
        :class="styles"
        transform="scale(0.9 1)"
        d="m15 134.99c-0.0947-24.82 6.2099-50.094 20.678-70.294 16.302-22.761 41.953-37.686 68.962-45.268 36.305-10.192 75.107-8.0428 112.09-0.66784 39.009 7.7788 76.974 21.336 111.36 41.289 14.236 8.263 28.01 17.757 38.712 30.24 10.702 12.484 18.167 28.28 18.2 44.7 0.033 16.363-7.3191 32.141-17.918 44.636-10.598 12.496-24.278 22.027-38.44 30.304-34.321 20.059-72.335 33.527-111.36 41.289-36.989 7.359-75.797 9.566-112.09-0.6679-27.288-7.6944-53.135-22.931-69.515-46.004-14.236-20.053-20.584-44.993-20.678-69.558z"
        :fill="`url(#eggGradient-${seed})`"
        :stroke-width="strokeWidth ?? 3"
      />
    </g>
    <g
      v-if="showBush"
      v-for="transform of ['translate(105 110)', 'translate(-130 110)']"
      viewBox="50 0 100 100"
      :transform="transform"
    >
      <g transform="translate(7.246111 37.279278)">
        <path
          d="M150.40569,150c0-47.72407,35.69104-86.41207,79.71818-86.41207c3.5989,0,7.1421.25851,10.61466.75933C206.6926,69.97324,180.42691,106.17703,180.42691,150c0,2.91761.11642,5.80144.34381,8.64473h-29.9711c-.26054-2.84329-.39393-5.72712-.39393-8.64473Z"
          fill="#00da34"
          stroke="#000"
          class="wobble"
        />
        <path
          d="M172.16346,150c0-37.58977,35.06152-68.06229,78.31211-68.06229c3.53542,0,7.01613.20361,10.42744.59808C227.45758,86.96708,201.65517,115.48292,201.65517,150c0,2.92845.18572,5.81371.54608,8.64473h-29.4121c-.41289-2.83102-.62569-5.71628-.62569-8.64473Z"
          fill="#00da34"
          stroke="#000"
          class="wobble2"
        />
        <path
          d="M173.83335,47.05735c3.48587-1.5778,7.08295-2.76631,10.7664-3.58184-24.26616,18.88519-30.0682,64.8812-15.58245,115.16923h-31.73879c-9.8432-51.08678,3.51279-96.63164,36.55483-111.58738l.00001-.00001Z"
          transform="translate(.000001 0)"
          fill="#00da34"
          stroke="#000"
          class="wobble3"
        />
        <path
          d="M172.98392,149.20943c12.69367-35.38165,55.98585-52.22424,96.69579-37.61897c3.32774,1.19388,6.53522,2.56093,9.61294,4.08419-32.79954-7.08482-66.52805,10.80982-78.35916,42.97008h-30.48935c.58053-3.17079,1.42317-6.32293,2.53977-9.4353h.00001Z"
          fill="#00da34"
          stroke="#000"
          class="wobble"
        />
        <path
          d="M176.31912,69.11157c2.64881-2.34158,5.39149-4.49437,8.20858-6.45821-22.12308,25.4716-22.56816,63.92573.2932,89.78664c1.97039,2.22892,4.05486,4.29749,6.23703,6.20473h-37.25049c-13.64901-27.87437-5.17522-65.0576,22.51169-89.53316h-.00001Z"
          transform="translate(.000001 0)"
          fill="#00da34"
          stroke="#000"
          class="wobble2"
        />
      </g>
      <g transform="matrix(-.986718 0.16244 0.16244 0.986718 268.996688 16.1918)">
        <path
          d="M150.40569,150c0-47.72407,35.69104-86.41207,79.71818-86.41207c3.5989,0,7.1421.25851,10.61466.75933C206.6926,69.97324,180.42691,106.17703,180.42691,150c0,.83695.00958,1.67113.02861,2.50237l-29.77634,4.70689c-.18113-2.3771-.27349-4.78148-.27349-7.20925v-.00001Z"
          fill="#00da34"
          stroke="#000"
          class="wobble3"
        />
        <path
          d="M172.16346,150c0-37.58977,35.06152-68.06229,78.31211-68.06229c3.53542,0,7.01613.20361,10.42744.59808-33.17063,4.39488-58.82332,32.48017-59.24263,66.61462l-29.37729,4.64381c-.0794-1.25597-.11963-2.52101-.11963-3.79422Z"
          fill="#00da34"
          stroke="#000"
          class="wobble2"
        />
        <path
          d="M173.83335,47.05735c3.48587-1.5778,7.08295-2.76631,10.7664-3.58184-23.59665,18.36414-29.73399,62.36378-16.73514,111.01717L137.4074,159.3072c-10.08712-51.35512,3.24116-97.22949,36.42595-112.24984v-.00001Z"
          fill="#00da34"
          stroke="#000"
          class="wobble3"
        />
        <path
          d="M156.93171,33.39474c0,0,.44238-.07283,0,0-23.91581,18.61253-14.72052,70.19159,4.62624,122.09486l-29.7761,4.70685c-14.19741-55.91579-8.57139-111.53854,25.14986-126.80171Z"
          transform="translate(-.0659-.400303)"
          fill="#00da34"
          stroke="#000"
          class="wobble"
        />
        <path
          d="M176.31912,69.11157c2.64881-2.34158,5.39149-4.49437,8.20858-6.45821-21.96637,25.29117-22.56077,63.3816-.18911,89.23519l-31.3746,4.95953c-12.43523-27.65859-3.74106-63.78315,23.35513-87.73652v.00001Z"
          fill="#00da34"
          stroke="#000"
          class="wobble2"
        />
        <path
          d="M172.98392,149.20943c12.69367-35.38165,55.98585-52.22424,96.69579-37.61897c3.32774,1.19388,6.53522,2.56093,9.61294,4.08419-29.17635-6.3022-59.08777,7.16118-73.66757,32.84904l-34.1151,5.39274c.42349-1.57722.91431-3.1471,1.47394-4.707Z"
          fill="#00da34"
          stroke="#000"
          class="wobble3"
        />
      </g>
    </g>
  </svg>
</template>
