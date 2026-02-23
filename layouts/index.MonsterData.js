window.MONSTERS = [
{{- $monsters := where .Site.RegularPages "Section" "monster" -}}
{{- range sort $monsters "Params.id" }}
{
  id: "{{ .Params.id }}",
  title: "{{ .Params.title }}",
  element: "{{ .Params.element }}",
  attack_type: "{{ .Params.attack_type }}",
  attack_range: "{{ .Params.attack_range }}",
  level_shortcuts: {{ .Params.level_shortcuts | jsonify }},
  exp: {{ .Params.exp }},
  gold: {{ .Params.gold }},
  capture_rate: {{ .Params.capture_rate }},
  drops: {{ .Params.drops | jsonify }},
  locations: {{ .Params.locations | jsonify }},
  vit: {{ .Params.status.vit }},
  spd: {{ .Params.status.spd }},
  atk: {{ .Params.status.atk }},
  int: {{ .Params.status.int }},
  def: {{ .Params.status.def }},
  mdef: {{ .Params.status.mdef }},
  luk: {{ .Params.status.luk }}
}{{ if not (eq (add 1 $index) (len $monsters)) }},{{ end }}
{{- end }}
];
