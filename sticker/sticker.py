"""
Coffee Buddy - a cute always-on-top desktop sticker.

Run:  python sticker.py      (Windows: double-click run_sticker.bat)

Controls
  - Drag with left mouse button to move it anywhere
  - Double-click to make it wave hello (hearts!)
  - Right-click for the menu (size, bobbing, quit)
"""
import math
import random
import sys
import tkinter as tk

KEY = "#ff00fe"  # transparent "chroma key" color, never used in the drawing

CUP = "#fff4e6"
CUP_LINE = "#6b3e26"
COFFEE = "#8b5a3c"
BLUSH = "#ffb3c1"
HEART = "#ff6b8b"
STEAM = "#d9c3b0"
SLEEVE = "#f7a8b8"


class Sticker:
    def __init__(self):
        self.scale = 1.0
        self.bob = True
        self.t = 0.0
        self.blink = 0
        self.hearts = []  # [x, y, life]
        self.wave = 0

        self.root = tk.Tk()
        self.root.title("Coffee Buddy")
        self.root.overrideredirect(True)  # no title bar / border
        self.root.attributes("-topmost", True)
        self._setup_transparency()

        self.canvas = tk.Canvas(self.root, bg=self.bg, highlightthickness=0, bd=0)
        self.canvas.pack(fill="both", expand=True)
        self._resize()

        # start near bottom-right of the screen
        sw, sh = self.root.winfo_screenwidth(), self.root.winfo_screenheight()
        self.root.geometry(f"+{sw - self.w - 40}+{sh - self.h - 80}")

        self.canvas.bind("<ButtonPress-1>", self._start_drag)
        self.canvas.bind("<B1-Motion>", self._drag)
        self.canvas.bind("<Double-Button-1>", self._say_hi)
        self.canvas.bind("<Button-3>", self._menu)
        self.canvas.bind("<Button-2>", self._menu)  # macOS right-click

        self.menu = tk.Menu(self.root, tearoff=0)
        size = tk.Menu(self.menu, tearoff=0)
        for label, s in (("Tiny", 0.6), ("Small", 0.8), ("Normal", 1.0), ("Big", 1.4), ("Huge", 2.0)):
            size.add_command(label=label, command=lambda s=s: self._set_scale(s))
        self.menu.add_cascade(label="Size", menu=size)
        self.menu.add_command(label="Toggle bobbing", command=self._toggle_bob)
        self.menu.add_command(label="Say hi  ♥", command=self._say_hi)
        self.menu.add_separator()
        self.menu.add_command(label="Bye bye (quit)", command=self.root.destroy)

        self._animate()
        self._stay_on_top()

    # ---------- window setup ----------
    def _setup_transparency(self):
        self.bg = KEY
        if sys.platform.startswith("win"):
            self.root.attributes("-transparentcolor", KEY)
        elif sys.platform == "darwin":
            self.bg = "systemTransparent"
            self.root.attributes("-transparent", True)
            self.root.config(bg="systemTransparent")
        else:
            # Linux: color-key transparency isn't supported by Tk; use a soft background
            self.bg = "#ffe4ec"
            try:
                self.root.attributes("-alpha", 0.95)
            except tk.TclError:
                pass
        self.root.config(bg=self.bg)

    def _stay_on_top(self):
        """Keep re-asserting 'always on top' so other apps/games can't bury it."""
        try:
            self.root.attributes("-topmost", True)
            self.root.lift()
            if sys.platform.startswith("win"):
                import ctypes
                hwnd = ctypes.windll.user32.GetParent(self.root.winfo_id()) or self.root.winfo_id()
                HWND_TOPMOST, SWP_NOMOVE, SWP_NOSIZE, SWP_NOACTIVATE = -1, 0x2, 0x1, 0x10
                ctypes.windll.user32.SetWindowPos(
                    hwnd, HWND_TOPMOST, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE
                )
        except Exception:
            pass
        self.root.after(500, self._stay_on_top)

    def _resize(self):
        self.w, self.h = int(170 * self.scale), int(210 * self.scale)
        x, y = self.root.winfo_x(), self.root.winfo_y()
        self.root.geometry(f"{self.w}x{self.h}+{x}+{y}")

    # ---------- interaction ----------
    def _start_drag(self, e):
        self._dx, self._dy = e.x, e.y

    def _drag(self, e):
        x = self.root.winfo_x() + e.x - self._dx
        y = self.root.winfo_y() + e.y - self._dy
        self.root.geometry(f"+{x}+{y}")

    def _say_hi(self, e=None):
        self.wave = 40
        for _ in range(5):
            self.hearts.append([random.uniform(30, 140), 150, 1.0])

    def _menu(self, e):
        self.menu.tk_popup(e.x_root, e.y_root)

    def _set_scale(self, s):
        self.scale = s
        self._resize()

    def _toggle_bob(self):
        self.bob = not self.bob

    # ---------- drawing ----------
    def _animate(self):
        self.t += 0.08
        if self.blink > 0:
            self.blink -= 1
        elif random.random() < 0.012:
            self.blink = 5
        if self.wave > 0:
            self.wave -= 1
        for h in self.hearts:
            h[1] -= 1.6
            h[2] -= 0.012
        self.hearts = [h for h in self.hearts if h[2] > 0]

        self._draw()
        self.root.after(33, self._animate)

    def _draw(self):
        c, s = self.canvas, self.scale
        c.delete("all")
        oy = math.sin(self.t) * 4 if self.bob else 0

        def P(x, y):
            return x * s, (y + oy) * s

        def oval(x0, y0, x1, y1, **kw):
            c.create_oval(*P(x0, y0), *P(x1, y1), **kw)

        lw = max(2, int(3 * s))

        # steam
        for i, bx in enumerate((65, 85, 105)):
            pts = []
            for k in range(8):
                yy = 48 - k * 5
                xx = bx + math.sin(self.t * 1.5 + k * 0.8 + i) * 4
                pts.extend(P(xx, yy))
            c.create_line(*pts, fill=STEAM, width=max(2, int(4 * s)), smooth=True, capstyle="round")

        # handle
        oval(126, 99, 158, 141, outline=CUP_LINE, width=max(4, int(8 * s)))

        # cup body (rounded trapezoid)
        body = [P(28, 70), P(142, 70), P(132, 175), P(120, 190), P(50, 190), P(38, 175)]
        flat = [v for p in body for v in p]
        c.create_polygon(*flat, fill=CUP, outline=CUP_LINE, width=lw, smooth=True)

        # sleeve
        sleeve = [P(33, 120), P(137, 120), P(134, 150), P(36, 150)]
        c.create_polygon(*[v for p in sleeve for v in p], fill=SLEEVE, outline=CUP_LINE, width=lw)
        for hx in (50, 85, 120):  # tiny hearts on sleeve
            self._heart(hx, 135 + oy, 5, "#ffffff")

        # rim + coffee
        oval(24, 60, 146, 82, fill=CUP, outline=CUP_LINE, width=lw)
        oval(32, 64, 138, 78, fill=COFFEE, outline=COFFEE)
        oval(70, 67, 100, 74, fill="#c08a64", outline="")  # latte swirl

        # face
        if self.blink > 0:
            c.create_line(*P(60, 100), *P(72, 100), fill=CUP_LINE, width=lw, capstyle="round")
            c.create_line(*P(98, 100), *P(110, 100), fill=CUP_LINE, width=lw, capstyle="round")
        else:
            oval(59, 92, 73, 108, fill=CUP_LINE, outline="")
            oval(97, 92, 111, 108, fill=CUP_LINE, outline="")
            oval(63, 94, 68, 99, fill="white", outline="")
            oval(101, 94, 106, 99, fill="white", outline="")
        oval(46, 106, 60, 114, fill=BLUSH, outline="")
        oval(110, 106, 124, 114, fill=BLUSH, outline="")
        if self.wave > 0:  # happy open mouth
            c.create_arc(*P(76, 100), *P(94, 118), start=180, extent=180,
                         fill="#e85a7a", outline=CUP_LINE, width=lw)
        else:
            c.create_arc(*P(77, 102), *P(93, 114), start=200, extent=140,
                         style="arc", outline=CUP_LINE, width=lw)

        # waving little arm
        if self.wave > 0:
            ang = math.sin(self.wave * 0.5) * 0.6
            x0, y0 = 30, 110
            x1, y1 = x0 - 22 * math.cos(ang), y0 - 22 * math.sin(ang + 0.9)
            c.create_line(*P(x0, y0), *P(x1, y1), fill=CUP_LINE, width=lw * 2, capstyle="round")

        # floating hearts
        for hx, hy, life in self.hearts:
            self._heart(hx, hy, 9 * (0.6 + life * 0.4), HEART)

    def _heart(self, x, y, r, color):
        s = self.scale
        pts = []
        for i in range(24):
            a = i / 24 * 2 * math.pi
            hx = 16 * math.sin(a) ** 3
            hy = -(13 * math.cos(a) - 5 * math.cos(2 * a) - 2 * math.cos(3 * a) - math.cos(4 * a))
            pts.extend(((x + hx * r / 16) * s, (y + hy * r / 16) * s))
        self.canvas.create_polygon(*pts, fill=color, outline="", smooth=True)

    def run(self):
        self.root.mainloop()


if __name__ == "__main__":
    Sticker().run()
