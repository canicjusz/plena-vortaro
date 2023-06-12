<script lang="ts">
  import ChromaPicker from "svelte-chroma-picker";
  export let backgroundSaved: {
      color: string;
    },
    backgroundLocal = { color: "#f8ebe8" };

  export let textSaved: {
      color: string;
      size: number;
    },
    textLocal = { color: "#000", size: 15 };

  export let borderSaved: {
      color: string;
      width: number;
    },
    borderLocal = { color: "#000", width: 1 };

  export let turnedOnLocally = true;

  const copyLocal = () => {
    backgroundSaved = { ...backgroundLocal };
    textSaved = { ...textLocal };
    borderSaved = { ...borderLocal };
  };

  copyLocal();

  export const changeSettings = () => {
    copyLocal();
    chrome.storage.sync.set({
      background: backgroundLocal,
      text: textLocal,
      border: borderLocal,
    });
  };

  export const turnOff = () => {
    turnedOnLocally = !turnedOnLocally;
    chrome.storage.sync.set({ turnedOn: turnedOnLocally });
  };

  chrome.storage.sync.get(
    ["background", "text", "border", "turnedOn"],
    ({ background, text, border, turnedOn }) => {
      if (turnedOn === undefined) turnedOn = true;
      turnedOnLocally = turnedOn;
      if (background && text && border) {
        backgroundLocal = background;
        textLocal = text;
        borderLocal = border;
        copyLocal();
      } else {
        copyLocal();
      }
    }
  );

  $: somethingChanged = !(
    backgroundLocal.color === backgroundSaved.color &&
    textLocal.color === textSaved.color &&
    textLocal.size === textSaved.size &&
    borderLocal.color === borderSaved.color &&
    borderLocal.width === borderSaved.width
  );
</script>

<main>
  <div class="example">
    <h2 class="example__title">Antaŭmontro</h2>
    <div
      style="
          width: 300px;
          height: 300px;
          padding: 10px;
          overflow-y: auto;
          z-index: 2147483647;
					background: {backgroundLocal.color};
					font-size: {textLocal.size}px;
					color: {textLocal.color};
					border-width: {borderLocal.width}px;
					border-color: {borderLocal.color};
					border-style: solid;
          box-sizing: border-box;
        "
    >
      <strong class="d" id="d10691"
        ><span class="t"
          ><span data-tildo="⁓" data-teksto="esper">esper</span></span
        >anto</strong
      >. Homo, kiu
      <span class="t"
        ><span class="teksto" data-tildo="⁓" data-teksto="esper">esper</span
        ></span
      >as:
      <i
        >per laboro de la <span class="t"
          ><span class="teksto" data-tildo="⁓" data-teksto="esper">esper</span
          ></span
        >antoj</i
      ><span class="eta">&nbsp;</span><sup
        class="a tooltip"
        title="L. L. Zamenhof">Z</sup
      >.
      <span
        class="MANO tooltip"
        title="Vidu vorto(j)n de la sama semantika kampo">☞</span
      > <i>Esperanto</i>.
      <span class="tooltip Fundamenta" title="Fundamenta">★</span><strong
        class="kapvorto"
        id="k10702">Esperant<span class="s">/</span>o</strong
      >
      (<abbr class="tooltip abbr" title="vidu">Vd</abbr> <i>esper/anto</i>)
      <div class="div senco">
        <strong class="sekciokapo senco">1&nbsp;</strong><abbr
          class="tooltip abbr"
          title="Pseŭdonimo">Ps.</abbr
        > de L.L. Zamenhof okaze de la publikigo de la unua libro de lia lingvoprojekto.
      </div>
      <div class="div senco">
        <strong class="sekciokapo senco">2&nbsp;</strong>(ankaŭ
        <abbr class="tooltip abbr" title="minuskle">min.</abbr>)
        <span
          class="vinjeto LING tooltip"
          title="Lingvoscienco (inkl. fonetikon) kaj filologio"
          data-kodo="LING"
          dir="ltr">Λ</span
        >
        Lingvo sengenta, iniciatita de Z., kiu publikigis ĝiajn bazojn gramatikan
        k leksikan en 1887:
        <i
          >la lingvo <span class="t"
            ><span class="teksto" data-tildo="⁓" data-teksto="Esperant"
              >Esperant</span
            ></span
          >o</i
        ><span class="eta">&nbsp;</span><sup
          class="a tooltip"
          title="L. L. Zamenhof">Z</sup
        >;
        <i
          >ĉi tie oni parolas <span class="t"
            ><span class="teksto" data-tildo="⁓" data-teksto="Esperant"
              >Esperant</span
            ></span
          >on</i
        ><span class="eta">&nbsp;</span><sup
          class="a tooltip"
          title="L. L. Zamenhof">Z</sup
        >;
        <i
          ><span class="t"
            ><span class="teksto" data-tildo="⁓" data-teksto="Esperant"
              >Esperant</span
            ></span
          >o parolata</i
        ><span class="eta">&nbsp;</span><sup
          class="a tooltip"
          title="L. L. Zamenhof">Z</sup
        >;
        <i
          >traduki en <span class="t"
            ><span class="teksto" data-tildo="⁓" data-teksto="Esperant"
              >Esperant</span
            ></span
          >on</i
        ><span class="eta">&nbsp;</span><sup
          class="a tooltip"
          title="L. L. Zamenhof">Z</sup
        >;
        <i
          >en bona <span class="t"
            ><span class="teksto" data-tildo="⁓" data-teksto="Esperant"
              >Esperant</span
            ></span
          >o</i
        ><span class="eta">&nbsp;</span><sup
          class="a tooltip"
          title="L. L. Zamenhof">Z</sup
        >.
      </div>
    </div>
  </div>
  <div class="settings__container">
    <h2 class="settings__title">
      Agordoj {#if somethingChanged}<span class="settings__title-span"
          >(Memoru apliki ŝanĝojn!)</span
        >{/if}
    </h2>
    <div class="settings">
      <div class="setting">
        <details>
          <summary class="setting__title">Fono</summary>
          <div class="setting__content">
            <label class="setting__label" for="background"
              ><span class="setting__field">La koloro:</span>
              <ChromaPicker
                bind:color={backgroundLocal.color}
                class="setting__input"
                id="background"
              />
            </label>
          </div>
        </details>
      </div>
      <div class="setting">
        <details>
          <summary class="setting__title">Teksto</summary>
          <div class="setting__content">
            <label class="setting__label" for="size"
              ><span class="setting__field">La grandeco:</span><input
                type="range"
                bind:value={textLocal.size}
                min="1"
                max="35"
                step="1"
                class="setting__input"
                id="size"
              /></label
            >
            <label class="setting__label" for="color"
              ><span class="setting__field">La koloro:</span><ChromaPicker
                bind:color={textLocal.color}
                class="setting__input"
                id="color"
              /></label
            >
          </div>
        </details>
      </div>
      <div class="setting">
        <details>
          <summary class="setting__title">Bordero</summary>
          <div class="setting_content">
            <label class="setting__label" for="border-size"
              ><span class="setting__field">La larĝo:</span><input
                type="range"
                bind:value={borderLocal.width}
                min="0"
                max="25"
                step="1"
                class="setting__input"
                id="border-size"
              /></label
            >
            <label class="setting__label" for="border-color"
              ><span class="setting__field">La koloro:</span><ChromaPicker
                bind:color={borderLocal.color}
                class="setting__input"
                id="border-color"
              /></label
            >
          </div>
        </details>
      </div>
      <button on:click={changeSettings} class="settings__apply">Apliki</button>
    </div>
  </div>
</main>
<div class="switch__container">
  <button
    on:click={turnOff}
    class="switch {turnedOnLocally ? 'switch--on' : 'switch--off'}"
    >{turnedOnLocally ? "Malŝalti" : "Ŝalti"}</button
  >
</div>

<style lang="sass">
  $red: #b44346
  $gray: #EDEDED
  $green: #37A93A
  :global(html), :global(body)
    height: 100%
    margin: 0
    padding: 0
    font-size: 16px
    font-family: 'Open-sans', sans-serif
  main
    background: $gray
    padding: 10px
    display: flex
  .settings
    display: flex
    flex-direction: column
    overflow-y: auto
    height: 300px
    border: 1px solid black
    box-sizing: border-box
    &__title
      user-select: none
      margin: 0
      margin-bottom: 5px
      font-size: 1.6rem
      &-span
        font-size: 1rem
        color: $red
    &__container
      width: 300px
      padding-left: 10px
    &__apply
      box-sizing: border-box
      bottom: 0
      margin-top: auto
      border: none
      padding: 10px
      border-top: 1px solid black
      font-weight: 700
      font-size: 1.6rem
      background: black
      color: $gray
      cursor: pointer
      &:active
        background: $gray
        color: black
  .setting
    margin-bottom: 5px
    padding: 5px
    border-bottom: 1px solid black
    &__title
      user-select: none
      font-size: 1.6rem
    &__label
      user-select: none
    &__input
      display: block
    &__field
      display: block
      margin: 5px 0 5px 0
    &:nth-child(3)
      margin: 0
  .example__title
    user-select: none
    margin: 0
    font-size: 1.6rem
    margin-bottom: 5px
  .switch
    color: $gray
    box-sizing: border-box
    bottom: 0
    margin-top: auto
    border: none
    padding: 10px
    border-top: 1px solid black
    font-weight: 700
    font-size: 1.6rem
    background: black
    color: $gray
    cursor: pointer
    &__container
      width: 100%
      display: flex
      flex-direction: column
    &--on
      background: $green
    &--off
      background: $red
    &:active
      background: $gray
      color: black
</style>
