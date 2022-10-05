// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/
'use strict'
import { printTimestamp } from './vtt-helper.js'

var EDGEMARGIN = 0 /* % */
var fontWeight = 500
var WebVTT2DocumentFragment = function () {
    var regions = []

    /* construct DOM tree out of cue content */
    function tree2HTML(tree) {
        var result = '',
            treeLength = tree.length
        for (var i = 0; i < treeLength; i++) {
            var node = tree[i],
                nodeType = node.type,
                nodeClasses = node.classes
            if (nodeType === 'text')
                result += node.value.replace(/\n/g, '<br/>')
            else if (nodeType === 'object') {
                if (node.name === 'c') {
                    result += '<span'
                    if (nodeClasses) {
                        result += ' class=\"'
                        var nodeClassesLength = nodeClasses.length
                        for (var y = 0; y < nodeClassesLength; y++) {
                            if (y > 0) {
                                result += ' '
                            }
                            result += nodeClasses[y]
                        }
                        result += '\"'
                    }
                    result += '>';
                } else if (node.name === 'v') {
                    result += '<span'
                    if (node.value)
                        result += ` title="${node.value}"`
                    result += '>'
                } else
                    result += `<${node.name}>`
                if (node.children)
                    result += tree2HTML(node.children)
                if (node.name === ('c' || 'v'))
                    result += '</span>'
                else
                    result += `</${node.name}>`
            } else if (nodeType === 'timestamp')
                result += `<?timestamp ${printTimestamp(node.value)} ?>`
        }
        return result
    }

    function getTextHeight(element, parent, styles) {
        var temp = document.createElement(element.nodeName)
        temp.setAttribute('style', styles)
        temp.innerHTML = element.innerHTML
        temp = parent.appendChild(temp)
        var ret = temp.clientHeight
        parent.removeChild(temp)
        return ret
    }

    function isNumber(n) { return !isNaN(parseFloat(n)) && isFinite(n) }

    /* convert cue settings to CSS for cue span */
    /* TODO: vertical settings; rtl text */
    function renderNormalCue(cue, videoWidth, videoHeight, parent) {
        var maxsize = 0,
            size = 0,
            width = 0,
            height = 0,
            xposition = 0,
            yposition = 0,
            xpadding = 0,
            ypadding = 0,
            rightmarginedge = 0,
            left = 0,
            top = 0,
            margin = 0,
            maxdimension = 0,
            fullDimension = 0,
            lineHeight = 0,
            fontSize = 0,
            step = 0,
            linePosition = 0,
            position = 0,
            spanHeight = 0,
            cssCue = ''

        // 1. create nodes
        var domFragment = document.createElement('span')
        if (cue.id)
            domFragment.setAttribute('id', cue.id)

        /* set defaults */
        lineHeight = 0.0533 * videoHeight
        fontSize = lineHeight / 1.3
        // 12. apply css
        cssCue = 'position:absolute;'
        cssCue += ' display:inline;'
        cssCue += ' unicode-bidi:-webkit-plaintext; unicode-bidi:-moz-plaintext; unicode-bidi:plaintext;'
        cssCue += ' background:rgba(0,0,0,0.7);'
        cssCue += ' backdrop-filter:blur(0.2em);'
        cssCue += ' word-wrap:break-word; overflow-wrap:break-word;'
        cssCue += ` font-size:${fontSize}px;`
        cssCue += ` font-weight:${fontWeight};`
        cssCue += ' font-family:Manrope,Arial,Helvetica,sans-serif;'
        cssCue += ` line-height:${lineHeight}px;`
        cssCue += ' color:var(--text-color);'
        cssCue += ' border-radius:0.3em;'

        // 3. determine direction (FIXME: rtl support)
        cssCue += ' direction:ltr;'

        // 4. text track cue writing direction
        switch (cue.direction) {
            case 'lr':
                cssCue += ' writing-mode:vertical-lr;-webkit-writing-mode:vertical-lr;'
            case 'rl':
                cssCue += ' writing-mode:vertical-rl;-webkit-writing-mode:vertical-rl;'
            default:
                cssCue += ' writing-mode:horizontal-tb;-webkit-writing-mode:horizontal-tb;'
        }

        // 5. determine maximum size for cue
        /* assuming ltr */
        if (cue.alignment === 'start') {
            cssCue += ' text-align:start;'
            maxsize = 100 - cue.textPosition
        } else if (cue.alignment === 'end') {
            cssCue += ' text-align:end;'
            maxsize = cue.textPosition
        } else if (cue.alignment === 'middle' && cue.textPosition <= 50) {
            cssCue += ' text-align:center;'
            maxsize = cue.textPosition * 2
        } else if (cue.alignment === 'middle' && cue.textPosition > 50) {
            cssCue += ' text-align:center;'
            maxsize = (100 - cue.textPosition) * 2
        } else if (cue.alignment === 'left') {
            cssCue += ' text-align:left;'
            maxsize = 100 - cue.textPosition;
        } else if (cue.alignment === 'right') {
            cssCue += ' text-align:right;'
            maxsize = cue.textPosition
        }

        // 6. determine cue size
        if (cue.size < maxsize)
            size = cue.size
        else
            size = maxsize

        // 8. determine positioning xposition
        if (cue.alignment === 'start' || cue.alignment === 'left')
            xposition = cue.textPosition
        else if (cue.alignment === 'end' || cue.alignment === 'right')
            xposition = cue.textPosition - size
        else if (cue.alignment === 'middle')
            xposition = cue.textPosition - (size / 2)

        // calculate computed line position
        if (isNumber(cue.linePosition)) {
            linePosition = cue.linePosition;
            if (cue.snapToLines === false)
                if (cue.linePosition < 0 || cue.linePosition > 100)
                    linePosition = 100
        } else { // 'auto' linePosition
            if (cue.snapToLines === false)
                linePosition = 100
            else
                // FIXME: missing adaptation of line position based on
                // number of active tracks at one time
                linePosition = -1
        }

        // 9. calculate yposition
        if (cue.snapToLines === true)
            yposition = 0
        else
            yposition = linePosition

        // 10. Only apply edgemargin to non-percentage positioned cues
        // why is there no margin in yposition dimension?
        // https://www.w3.org/Bugs/Public/show_bug.cgi?id=19744
        if (cue.snapToLines === true) {
            var edgemargin = EDGEMARGIN * videoWidth / 100
            if (xposition < edgemargin && (xposition + size > edgemargin)) {
                xposition += edgemargin
                size -= edgemargin
            }
            rightmarginedge = 100 - edgemargin;
            if (xposition < rightmarginedge && (xposition + size > rightmarginedge))
                size -= edgemargin
        }

        // 7. width & height of cue
        width = size * videoWidth / 100
        cssCue += ` width:${width}px;`

        height = 'auto'
        cssCue += ' height:auto;'

        xpadding = videoWidth / 500 * 5
        ypadding = videoWidth / 1000 * 5
        cssCue += ` padding:${ypadding}px ${xpadding}px;`

        // 11. set left and top
        left = xposition * videoWidth / 100
        cssCue += ` left:${left}px;`

        top = yposition * videoHeight / 100

        // attach the innerHTML so we can measure the height for adjustments.
        domFragment.innerHTML = tree2HTML(cue.tree.children)
        spanHeight = getTextHeight(domFragment, parent, cssCue)

        // 14. adjust positions of boxes
        if (cue.snapToLines === true) {
            margin = EDGEMARGIN * videoHeight / 100
            fullDimension = videoHeight
            maxdimension = fullDimension - (2 * margin)
            step = lineHeight
            position = step * linePosition

            if (linePosition < 0) {
                position += maxdimension
                step *= -1
            } else position += margin
            top += position

            // FIXME: adjustment not according to spec
            // calculate how much of the cue is outside the video viewport
            var score = maxdimension - top - spanHeight;
            while (top > 0 && score < 0 && top < maxdimension) {
                top += step
                score = maxdimension - top - spanHeight
            }

        } else {
            // Requested to fix relative positioning:
            // https://www.w3.org/Bugs/Public/show_bug.cgi?id=18501
            var x = cue.textPosition
            var boxPositionX = x * width / 100
            left = left - boxPositionX
            var y = linePosition
            var boxPositionY = y * spanHeight / 100
            top = top - boxPositionY
        }

        cssCue += ` top:${top}px;`;

        // attach the CSS
        domFragment.setAttribute('style', cssCue)

        return {
            region: '',
            cue: domFragment
        }
    }

    function setupRegion(regionAttributes, videoWidth, videoHeight) {
        var domFragment = document.createElement('span')
        var lineHeight = 0,
            fontSize = 0,
            cssRegion = ''

        /* set defaults */
        lineHeight = 0.0533 * videoHeight
        fontSize = lineHeight / 1.3

        cssRegion = 'position:absolute;'
        cssRegion += ' unicode-bidi:-webkit-plaintext; unicode-bidi:-moz-plaintext; unicode-bidi:plaintext;'
        cssRegion += ' direction:ltr;'
        cssRegion += ' word-wrap:break-word; overflow-wrap:break-word;'
        cssRegion += ` font-size:${fontSize}px;`
        cssRegion += ` font-weight:${fontWeight};`
        cssRegion += ' font-family:Manrope,Arial,Helvetica,sans-serif;'
        cssRegion += ` line-height:${lineHeight}px;`
        cssRegion += ' color:var(--text-color);'

        cssRegion += ' overflow:hidden;'

        // TODO: vertical cues.
        cssRegion += ' writing-mode:horizontal-tb;-webkit-writing-mode:horizontal-tb;'

        // calculate width and height of region
        var width = regionAttributes.width * videoWidth / 100
        cssRegion += ` width:${width}px;`

        var height = regionAttributes.lines * Math.floor(lineHeight)
        cssRegion += ` height:${height}px;`
        cssRegion += ' min-height:0px;'

        // calculate left and bottom positioning of region
        var left = regionAttributes.viewportanchorX * videoWidth / 100 - regionAttributes.regionanchorX * width / 100
        cssRegion += ` left:${left}px;`
        var top = regionAttributes.viewportanchorY * videoHeight / 100 - regionAttributes.regionanchorY * height / 100
        var bottom = videoHeight - height - top
        cssRegion += ` bottom:${bottom}px;`

        // set the CSS on the domFragment
        domFragment.setAttribute('style', cssRegion)
        domFragment.setAttribute('id', 'region_' + regionAttributes.id)

        var domContainer = document.createElement('span')
        domContainer.style.position = 'absolute'
        domContainer.style.height = 'auto'
        domContainer.style.bottom = 0
        domContainer.style.width = '100%'
        domContainer.style.backgroundColor = 'rgba(0,0,0,0.7)'
        domContainer.style.borderRadius = '0.3em'
        domContainer.style.transition = '450ms'
        domFragment.appendChild(domContainer)
        return {
            id: regionAttributes.id,
            element: domFragment,
            attributes: regionAttributes
        }
    }

    function getRegionDom(regionId, parent) {
        var i
        var nodes = parent.childNodes
        for (i = 0; i < nodes.length; i++)
            if (nodes[i].id === 'region_' + regionId)
                return nodes[i].firstChild;
        return
    }

    function getRegion(regionId) {
        var i;
        for (i = 0; i < regions.length; i++)
            if (regions[i].id === regionId)
                return regions[i]
        return
    }

    function renderRegionCue(cue, videoWidth, videoHeight, parent) {
        var lineHeight = 0,
            fontSize = 0,
            left = 0,
            top = 0,
            cssRegion = '',
            cssCueText = '',
            region, regionAttributes, domFragment;

        // run normal layout if cue is vertical
        if (cue.direction === 'lr' || cue.direction === 'rl')
            return renderNormalCue(cue, videoWidth, videoHeight, parent)

        // get Region & domFragment
        region = getRegion(cue.region)
        regionAttributes = region.attributes
        domFragment = getRegionDom(cue.region, parent)
        cssRegion = domFragment.getAttribute('style')

        /* set defaults */
        lineHeight = 0.0533 * videoHeight
        fontSize = lineHeight / 1.3

        // append a child to domFragment with adequate positioning, alignment and text
        var cueText = document.createElement('span')
        if (cue.id) cueText.setAttribute('id', cue.id)

        var cueTextContent = document.createElement('span')
        cueTextContent.innerHTML = tree2HTML(cue.tree.children)
        cueTextContent.setAttribute('class', regionAttributes.id)
        cueText.appendChild(cueTextContent)

        // set the CSS for the child
        cssCueText += ` font-size:${fontSize}px;`
        cssCueText += ` font-weight:${fontWeight};`
        cssCueText += ' font-family:Manrope,Arial,Helvetica,sans-serif;'
        cssCueText += ` line-height:${lineHeight}px;`
        cssCueText += ' color:var(--text-color);'
        //    cssCueText += ' -webkit-transition-duration: 0.433s;';

        if (cue.alignment === 'middle') {
            cssCueText += ' text-align:center;'
        } else {
            cssCueText += ` text-align:${cue.alignment};`
        }

        // ignore text position, since we're not positioning relative or absolute
        if (isNumber(cue.textPosition)) {
            left = cue.textPosition * (regionAttributes.width * videoWidth / 100) / 100
            cssCueText += ` left:${left}px;`
        }

        // get number of lines in cue to calculate height in pixels
        var cueHeight = getTextHeight(cueText, parent, cssCueText)
        //    var lines = cueHeight/12;
        //    cssCueText += ' height:' + lines * lineHeight + 'px;';

        cueText.setAttribute('style', cssCueText)

        // adjust height of region to transition
        var regionHeight = getTextHeight(domFragment, parent, cssRegion)
        regionHeight += cueHeight

        // reset the CSS on the domFragment
        domFragment.setAttribute('style', cssRegion)
        domFragment.style.height = `${regionHeight}px`

        return {
            region: domFragment,
            cue: cueText
        }
    }

    /* convert cue to a HTML fragment */
    function cue2DOMFragment(cue, videoWidth, videoHeight, parent) {
        var domFragment

        if (cue.region)
            domFragment = renderRegionCue(cue, videoWidth, videoHeight, parent)
        else
            domFragment = renderNormalCue(cue, videoWidth, videoHeight, parent)

        return {
            cue: domFragment.cue,
            region: domFragment.region,
            startTime: cue.startTime,
            endTime: cue.endTime
        }
    }

    /* set up regions for cues to paint into */
    this.prepareRegions = function (metadatas, videoWidth, videoHeight) {
        var i
        for (i = 0; i < metadatas.length; i++)
            if (metadatas[i].name === 'Region') regions.push(setupRegion(metadatas[i].regionAttributes, videoWidth, videoHeight))
    }

    /* set up regions for cues to paint into */
    this.appendRegions = function (parent) {
        var i
        for (i = 0; i < regions.length; i++) parent.appendChild(regions[i].element)
    }

    /* set up regions for cues to paint into */
    this.cloneRegions = function (parent) {
        var i
        var clone
        for (i = 0; i < regions.length; i++) {
            clone = regions[i].element.cloneNode(true);
            parent.appendChild(clone)
        }
    }

    this.captionShow = function (cue, number, videoWidth, videoHeight, parent) {
        var output
        output = cue2DOMFragment(cue, videoWidth, videoHeight, parent)
        output.cue.setAttribute('id', number + '_' + cue.startTime.toFixed(2))
        if (!output.region) parent.appendChild(output.cue)
        else output.region.appendChild(output.cue)
    }

    this.captionRemove = function (cue, number) {
        var cue, element
        element = document.getElementById(number + '_' + cue.startTime.toFixed(2))
        var parent = element.parentElement
        if (cue.region) {
            parent.style.height = 'auto'
            parent.removeChild(element)
            var regionHeight = parent.getBoundingClientRect().height
            parent.style.height = `${regionHeight}px`
        } else parent.removeChild(element)
    }
    return this
}

export { WebVTT2DocumentFragment }