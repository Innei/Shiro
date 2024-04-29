{{- define "fullname" -}}
{{- if .Release.Name -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s" .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{/* 
Convert image pull secrets to docker config json 
*/}}
{{- define "common.dockerconfig" -}}
{{- if .Values.imagePullSecrets -}}
{{- $last := sub (len .Values.imagePullSecrets) 1 }}
{
  "auths": {
{{- range $index, $secret := .Values.imagePullSecrets }}
    "{{ $secret.endpoint }}": {
      "username": "{{ $secret.username }}",
      "password": "{{ $secret.password }}",
      "auth": "{{ $secret.username }}:{{ $secret.password | b64enc }}"
    }{{- if ne $index $last }},{{- end }}
{{- end }}
  }
}
{{- end -}}
{{- end -}}
