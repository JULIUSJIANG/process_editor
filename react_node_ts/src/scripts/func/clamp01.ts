export default function clamp01(input: number) {
    return Math.min(Math.max(input, 0), 1);
}