// find the nearest right angle (in dergrees) among the angles {0, 90, 180, 270}
nearestRightAngle= function(angle) {
    angle = angle - Math.floor(angle/360)*360
    var d = Math.abs(angle)
    var out = 0

    var x = Math.abs(angle - 90)
    if (x < d) {
	out = (90)
	d = x
    }

    x = Math.abs(angle - 180)
    if (x < d) {
	out = (180)
	d = x
    }

    x = Math.abs(angle - 270)

    if (x < d) {
	out = (270)
	d = x
    }

    x = Math.abs(angle - 360)

    if (x < d) {
	out = (0)
	d = x
    }

    return out

}
