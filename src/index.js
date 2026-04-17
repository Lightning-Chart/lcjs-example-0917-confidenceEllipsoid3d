window.lcjsSmallView = window.devicePixelRatio >= 2
if (!window.__lcjsDebugOverlay) {
    window.__lcjsDebugOverlay = document.createElement('div')
    window.__lcjsDebugOverlay.style.cssText = 'position:fixed;top:10px;left:10px;background:rgba(0,0,0,0.7);color:#fff;padding:4px 8px;z-index:99999;font:12px monospace;pointer-events:none'
    const attach = () => { if (document.body && !window.__lcjsDebugOverlay.parentNode) document.body.appendChild(window.__lcjsDebugOverlay) }
    attach()
    setInterval(() => {
        attach()
        window.__lcjsDebugOverlay.textContent = window.innerWidth + 'x' + window.innerHeight + ' dpr=' + window.devicePixelRatio + ' small=' + window.lcjsSmallView
    }, 500)
}
/**
 * Example showcasing 3D variant of popular 2D statistics data visualization method of confidence ellipses
 */

const lcjs = require('@lightningchart/lcjs')
const { lightningChart, PointStyle3D, ColorShadingStyles, Themes, LegendPosition } = lcjs

const chart3D = lightningChart({
            resourcesBaseUrl: new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'resources/',
        })
    .Chart3D({
        legend: { position: LegendPosition.RightCenter },
        theme: (() => {
    const t = Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined
    return t && window.lcjsSmallView ? lcjs.scaleTheme(t, 0.5) : t
})(),
textRenderer: window.lcjsSmallView ? lcjs.htmlTextRenderer : undefined,
    })
    .setTitle('3D scatter data set and confidence ellipsoid')

chart3D.forEachAxis((axis) => axis.setInterval({ start: -1.8, end: 1.8 }))

const scatterSeries = chart3D.addPointSeries().setName('Scatter series')
const confidenceEllipsoidSeries = chart3D.addPointSeries().setName('Confidence ellipsoid').setPointerEvents(false)

const xSize = 1.2
const ySize = 1.2
const zSize = 1.5
const pi2 = Math.PI * 2
const data = new Array(1000).fill(0).map((_) => {
    // https://karthikkaranth.me/blog/generating-random-points-in-a-sphere/
    const u = Math.random()
    const v = Math.random()
    const theta = u * pi2
    const phi = Math.acos(2.0 * v - 1.0)
    const r = Math.cbrt(Math.random())
    const sinTheta = Math.sin(theta)
    const cosTheta = Math.cos(theta)
    const sinPhi = Math.sin(phi)
    const cosPhi = Math.cos(phi)
    const x = xSize * r * sinPhi * cosTheta
    const y = ySize * r * sinPhi * sinTheta
    const z = zSize * r * cosPhi
    return { x, y, z }
})
scatterSeries.add(data)

confidenceEllipsoidSeries
    .setDepthTestEnabled(false)
    .setColorShadingStyle(new ColorShadingStyles.Simple())
    .setPointStyle(
        new PointStyle3D.Triangulated({
            // Ellipsoid is rendered as sphere with individual sizes along X, Y and Z axes.
            shape: 'sphere',
            size: { x: xSize * 2, y: ySize * 2, z: zSize * 2 },
            fillStyle: scatterSeries.getPointStyle().getFillStyle().setA(50),
        }),
    )
    .add({ x: 0, y: 0, z: 0 })
