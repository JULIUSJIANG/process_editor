export default function wrap (value: number, min: number, max: number) {
    let range = max - min;
    if (range == 0) return min;
    return (value - min) % range + min;
}