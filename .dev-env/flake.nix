{
  description = "mocoapp";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          devShells.default = pkgs.mkShell rec {
            packages = with pkgs; [
              nodejs_20
              yarn
              hivemind
            ] ++ lib.optionals (!stdenv.isDarwin) [
              # chromium is not packaged for darwin in nixpkgs
              chromium
            ];

            PROJECT_ROOT = builtins.getEnv "PWD";
            LD_LIBRARY_PATH = [ "${pkgs.curl.out}/lib" ];
            HIVEMIND_PROCFILE = "${PROJECT_ROOT}/.dev-env/Procfile";
            HIVEMIND_ROOT = "${PROJECT_ROOT}";
            HIVEMIND_PORT = 3000;

            shellHook = ''
              [ -d node_modules ] || yarn
              echo "Start development by running 'hivemind'"
            '';
          };
        }
      );
}
